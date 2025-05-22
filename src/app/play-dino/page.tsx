// src/app/play-dino/page.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
// --- อัปเดต Imports สำหรับ Wagmi v2 ---
import { 
    useAccount, 
    useConnect, 
    useDisconnect, 
    useSimulateContract,
    useWriteContract,
    useWaitForTransactionReceipt,
    useChainId, 
    useSwitchChain 
} from 'wagmi';
//import { InjectedConnector } from 'wagmi/connectors/injected';
import { DINO_REWARD_CONTRACT_ADDRESS, DINO_REWARD_CONTRACT_ABI } from '../../lib/contracts';
import { monadTestnet } from '../../lib/wagmiConfig'; 

// --- Game Constants (จากโค้ดที่คุณให้มา) ---
const GAME_AREA_WIDTH = 600;
const GAME_AREA_HEIGHT = 250;
const DINO_IMAGE_DISPLAY_WIDTH = 70;
const DINO_IMAGE_DISPLAY_HEIGHT_STAND = 70;
const DINO_IMAGE_DISPLAY_HEIGHT_CROUCH = 50;
const DINO_COLLISION_WIDTH = 60;
const DINO_COLLISION_HEIGHT_STAND = 30;
const DINO_COLLISION_HEIGHT_CROUCH = 10;
const DINO_START_X = 50;
const DINO_BOTTOM_Y = 0;

const TREE_WIDTH_COLOR = 30;
const TREE_HEIGHT_COLOR_MIN = 40;
const TREE_HEIGHT_COLOR_MAX = 70;
const THORNS_WIDTH_COLOR = 50;
const THORNS_HEIGHT_COLOR = 25;
const BIRD_WIDTH_COLOR = 40;
const BIRD_HEIGHT_COLOR = 30;
const BIRD_Y_POSITION_COLOR = DINO_BOTTOM_Y + DINO_COLLISION_HEIGHT_CROUCH + 15;
const PIT_WIDTH_COLOR = 70;
const PIT_HEIGHT_COLOR = 15;

const GRAVITY = 0.75;
const JUMP_STRENGTH = 18;
const INITIAL_GAME_SPEED = 5;
const OBSTACLE_SPAWN_INTERVAL_MIN = 1600;
const OBSTACLE_SPAWN_INTERVAL_MAX = 2800;
const GAME_LOOP_INTERVAL = 20;
const SCORE_INTERVAL = 100;
const SPEED_INCREASE_SCORE_INTERVAL = 30;
const SPEED_INCREASE_AMOUNT = 0.1;
const MAX_GAME_SPEED = 12;

const OBSTACLE_TYPES = {
  TREE: 'tree', THORNS: 'thorns', PIT: 'pit', BIRD_LOW: 'bird_low',
} as const;
type ObstacleType = typeof OBSTACLE_TYPES[keyof typeof OBSTACLE_TYPES];
interface Obstacle {
  element: HTMLDivElement; x: number; y: number; type: ObstacleType; height: number; width: number;
}
// --- สิ้นสุด Game Constants ---

const MIN_SCORE_FOR_REWARD = 100;
const REWARD_AMOUNT_DISPLAY = "0.1 MON";

export default function DinoGamePage() {
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const dinoContainerRef = useRef<HTMLDivElement>(null);
  const dinoImageElementRef = useRef<HTMLImageElement | null>(null);
  const gameOverMessageRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [isCrouching, setIsCrouching] = useState(false);

  // --- State สำหรับการ Claim รางวัล และ Popup ---
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [hasClaimedThisSession, setHasClaimedThisSession] = useState(false);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimTxHash, setClaimTxHash] = useState<`0x${string}` | null>(null);
  const [showClaimPopup, setShowClaimPopup] = useState(false); // <<! State สำหรับควบคุม Popup
  // --- สิ้นสุด State รางวัล ---


  const dinoYRef = useRef(DINO_BOTTOM_Y);
  const dinoVelocityYRef = useRef(0);
  const obstaclesRef = useRef<Obstacle[]>([]);
  const gameSpeedRef = useRef(INITIAL_GAME_SPEED);
  const lastScoreSpeedIncreaseRef = useRef(0);

  const scoreIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const gameLoopIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const obstacleSpawnerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isPlayingRef = useRef(isPlaying);
  useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);

  // src/app/play-dino/page.tsx

// ... (โค้ดอื่นๆ) ...

// บรรทัด 99
const { address: userAddress, isConnected } = useAccount();
// บรรทัด 100 (แก้ไข)
const { connect, connectors, error: connectError, status: connectStatus,  } = useConnect();
const isConnecting = connectStatus === 'pending'; // หรือดูจาก pendingConnector
// บรรทัด 101
const { disconnect } = useDisconnect();
// บรรทัด 102
const currentChainId = useChainId();
// บรรทัด 103 (แก้ไข)
const { switchChain, isPending: isSwitchingChain, error: switchChainError } = useSwitchChain();

  const fidToClaim = useRef<number>(12345);
  useEffect(() => {
    if (userAddress) {
      try {
        const lastFourHex = userAddress.slice(-4);
        fidToClaim.current = parseInt(lastFourHex, 16) || 12345;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (_e) { fidToClaim.current = 12345; }
    } else {
      fidToClaim.current = 12345;
    }
  }, [userAddress]);

  const clearAllIntervalsAndTimers = useCallback(() => {
    if (scoreIntervalRef.current) clearInterval(scoreIntervalRef.current);
    if (gameLoopIntervalRef.current) clearInterval(gameLoopIntervalRef.current);
    if (obstacleSpawnerTimeoutRef.current) clearTimeout(obstacleSpawnerTimeoutRef.current);
    scoreIntervalRef.current = null; gameLoopIntervalRef.current = null; obstacleSpawnerTimeoutRef.current = null;
  }, []);

  const gameOver = useCallback(() => {
    if (!isPlayingRef.current) return;
    setIsPlaying(false);
    if (gameOverMessageRef.current) gameOverMessageRef.current.style.display = 'flex';
    
    if (currentScore >= MIN_SCORE_FOR_REWARD && !hasClaimedThisSession) { 
      setCanClaimReward(true);
      setShowClaimPopup(true); 
      setClaimMessage(`Congrats! Score ${currentScore}. You can claim ${REWARD_AMOUNT_DISPLAY}!`);
    } else {
      setCanClaimReward(false); 
      setClaimMessage(null); 
    }
  }, [currentScore, hasClaimedThisSession]); 

  const spawnObstacle = useCallback(() => {
    if (!gameAreaRef.current || !isPlayingRef.current) return;
    let obstacleType: ObstacleType;
    const randomType = Math.random();
    if (randomType < 0.35) { obstacleType = OBSTACLE_TYPES.TREE; }
    else if (randomType < 0.65) { obstacleType = OBSTACLE_TYPES.THORNS; }
    else if (randomType < 0.85) { obstacleType = OBSTACLE_TYPES.PIT; }
    else { obstacleType = OBSTACLE_TYPES.BIRD_LOW; }
    const el = document.createElement('div');
    let h = 0, w = 0, y = DINO_BOTTOM_Y;
    el.style.position = 'absolute'; el.style.left = `${GAME_AREA_WIDTH}px`;
    if (obstacleType === OBSTACLE_TYPES.TREE) {
      h = Math.random() * (TREE_HEIGHT_COLOR_MAX - TREE_HEIGHT_COLOR_MIN) + TREE_HEIGHT_COLOR_MIN;
      w = TREE_WIDTH_COLOR; el.style.backgroundColor = 'sienna';
    } else if (obstacleType === OBSTACLE_TYPES.THORNS) {
      h = THORNS_HEIGHT_COLOR; w = THORNS_WIDTH_COLOR; el.style.backgroundColor = 'forestgreen';
    } else if (obstacleType === OBSTACLE_TYPES.PIT) {
      h = PIT_HEIGHT_COLOR; w = PIT_WIDTH_COLOR; el.style.backgroundColor = 'dimgray';
    } else if (obstacleType === OBSTACLE_TYPES.BIRD_LOW) {
      h = BIRD_HEIGHT_COLOR; w = BIRD_WIDTH_COLOR; el.style.backgroundColor = 'skyblue';
      y = BIRD_Y_POSITION_COLOR;
    }
    el.style.width = `${w}px`; el.style.height = `${h}px`; el.style.bottom = `${y}px`;
    if(gameAreaRef.current) gameAreaRef.current.appendChild(el);
    obstaclesRef.current.push({ element: el, x: GAME_AREA_WIDTH, y: y, type: obstacleType, height: h, width: w });
    if (isPlayingRef.current) {
      const nextDelay = Math.random() * (OBSTACLE_SPAWN_INTERVAL_MAX - OBSTACLE_SPAWN_INTERVAL_MIN) + OBSTACLE_SPAWN_INTERVAL_MIN - (gameSpeedRef.current - INITIAL_GAME_SPEED) * 100;
      if(obstacleSpawnerTimeoutRef.current) clearTimeout(obstacleSpawnerTimeoutRef.current);
      obstacleSpawnerTimeoutRef.current = setTimeout(spawnObstacle, Math.max(600, nextDelay));
    }
  }, []);

  const gameLoop = useCallback(() => {
    if (!dinoContainerRef.current || !isPlayingRef.current) return;
    dinoVelocityYRef.current -= GRAVITY;
    dinoYRef.current += dinoVelocityYRef.current;
    if (dinoYRef.current < DINO_BOTTOM_Y) {
      dinoYRef.current = DINO_BOTTOM_Y; dinoVelocityYRef.current = 0;
    }
    dinoContainerRef.current.style.bottom = `${dinoYRef.current}px`;
    const cDCH = isCrouching ? DINO_COLLISION_HEIGHT_CROUCH : DINO_COLLISION_HEIGHT_STAND;
    const dL = DINO_START_X, dR = DINO_START_X + DINO_COLLISION_WIDTH, dB = dinoYRef.current, dT = dinoYRef.current + cDCH;
    for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
      const o = obstaclesRef.current[i]; o.x -= gameSpeedRef.current; o.element.style.left = `${o.x}px`;
      const oL = o.x, oR = o.x + o.width, oB = o.y, oT = o.y + o.height;
      const hO = dL < oR && dR > oL, vO = dB < oT && dT > oB;
      if (hO && vO) {
        if (o.type === OBSTACLE_TYPES.TREE || o.type === OBSTACLE_TYPES.THORNS || (o.type === OBSTACLE_TYPES.PIT && dB < o.height) || (o.type === OBSTACLE_TYPES.BIRD_LOW && !isCrouching)) {
          gameOver(); return;
        }
      }
      if (o.x < -o.width) { o.element.remove(); obstaclesRef.current.splice(i, 1); }
    }
  }, [isCrouching, gameOver]);

  const startGame = useCallback(() => {
    if (!dinoContainerRef.current || !gameOverMessageRef.current || !gameAreaRef.current || !dinoImageElementRef.current) {
      console.error("startGame: Critical refs not available!"); return;
    }
    setIsPlaying(true); setCurrentScore(0); setIsCrouching(false);
    dinoYRef.current = DINO_BOTTOM_Y; dinoVelocityYRef.current = 0; gameSpeedRef.current = INITIAL_GAME_SPEED; lastScoreSpeedIncreaseRef.current = 0;
    
    setCanClaimReward(false); 
    setHasClaimedThisSession(false); 
    setShowClaimPopup(false); 
    setClaimMessage(null); 
    setClaimTxHash(null);
    setIsClaiming(false);

    obstaclesRef.current.forEach(o => { if (o.element && o.element.parentNode) o.element.remove(); }); obstaclesRef.current = [];
    gameOverMessageRef.current.style.display = 'none';
    dinoContainerRef.current.style.height = `${DINO_COLLISION_HEIGHT_STAND}px`; dinoContainerRef.current.style.width = `${DINO_COLLISION_WIDTH}px`;
    dinoContainerRef.current.style.bottom = `${dinoYRef.current}px`; dinoContainerRef.current.style.left = `${DINO_START_X}px`;
    dinoImageElementRef.current.src = '/images/dino-assets/dino_run.png';
    dinoImageElementRef.current.style.height = `${DINO_IMAGE_DISPLAY_HEIGHT_STAND}px`; dinoImageElementRef.current.style.width = `${DINO_IMAGE_DISPLAY_WIDTH}px`;
    clearAllIntervalsAndTimers();
    scoreIntervalRef.current = setInterval(() => { if (isPlayingRef.current) { setCurrentScore(pS => { const nS = pS + 1; if (nS - lastScoreSpeedIncreaseRef.current >= SPEED_INCREASE_SCORE_INTERVAL) { if (gameSpeedRef.current < MAX_GAME_SPEED) { gameSpeedRef.current = parseFloat((gameSpeedRef.current + SPEED_INCREASE_AMOUNT).toFixed(2)); } lastScoreSpeedIncreaseRef.current = nS; } return nS; }); } }, SCORE_INTERVAL);
    if (obstacleSpawnerTimeoutRef.current) clearTimeout(obstacleSpawnerTimeoutRef.current);
    const iSD = Math.random()*(OBSTACLE_SPAWN_INTERVAL_MAX-OBSTACLE_SPAWN_INTERVAL_MIN)+OBSTACLE_SPAWN_INTERVAL_MIN - (gameSpeedRef.current-INITIAL_GAME_SPEED)*100;
    obstacleSpawnerTimeoutRef.current = setTimeout(spawnObstacle, Math.max(600, iSD));
    gameLoopIntervalRef.current = setInterval(gameLoop, GAME_LOOP_INTERVAL);
  }, [clearAllIntervalsAndTimers, gameLoop, spawnObstacle]);

  const jump = useCallback(() => {
    if (!isPlayingRef.current || isCrouching) return;
    if (Math.abs(dinoYRef.current - DINO_BOTTOM_Y) < 1) {
      dinoVelocityYRef.current = JUMP_STRENGTH;
    }
  }, [isCrouching]);

  const crouch = useCallback((shouldCrouch: boolean) => {
    if (!isPlayingRef.current) return;
    if (dinoYRef.current > DINO_BOTTOM_Y + 1 && shouldCrouch) return;
    setIsCrouching(shouldCrouch);
  }, []);

  const argsForClaim = [BigInt(fidToClaim.current), BigInt(currentScore)];
  const isEligibleToSimulate = isConnected && 
                               canClaimReward && 
                               !hasClaimedThisSession && 
                               currentScore >= MIN_SCORE_FOR_REWARD && 
                               showClaimPopup &&
                               currentChainId === monadTestnet.id;

  const { 
    data: simulateData, 
    error: simulateError, 
    isLoading: isSimulatingContractWrite, 
    refetch: refetchSimulateContractWrite 
  } = useSimulateContract({
    address: DINO_REWARD_CONTRACT_ADDRESS, abi: DINO_REWARD_CONTRACT_ABI, functionName: 'claimReward',
    args: argsForClaim, query: { enabled: isEligibleToSimulate },
  });

  useEffect(() => {
    if (showClaimPopup) {
        if (simulateError) {
          console.error('[SimulateContract Error Hook - Popup Visible]:', simulateError);
          setClaimMessage(`Error preparing claim: ${simulateError.message}`);
        }
        if (simulateData) {
            console.log('[SimulateContract Data Hook - Popup Visible]: Request prepared ->', simulateData.request ? 'YES' : 'NO', simulateData);
            if (claimMessage && (claimMessage.startsWith("Error preparing claim") || claimMessage.startsWith("Claim not ready"))) {
                if (simulateData.request) {
                     setClaimMessage(canClaimReward ? `Score ${currentScore}! Claim ${REWARD_AMOUNT_DISPLAY}!` : null);
                }
            }
        }
    }
  }, [simulateData, simulateError, showClaimPopup, canClaimReward, currentScore, claimMessage]);

  const { writeContractAsync, data: writeContractData, isPending: isWriteContractLoading, error: writeContractError } = useWriteContract();
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess, isError: isTransactionError, data: transactionReceipt } = useWaitForTransactionReceipt({
    hash: writeContractData, confirmations: 1,
  });

  useEffect(() => {
    const conditionsMet = isConnected && canClaimReward && !hasClaimedThisSession && currentScore >= MIN_SCORE_FOR_REWARD && showClaimPopup;
    if (conditionsMet) {
      refetchSimulateContractWrite?.();
    }
  }, [isConnected, canClaimReward, hasClaimedThisSession, currentScore, showClaimPopup, refetchSimulateContractWrite]);

  const handleClaimReward = async () => {
    if (!isConnected) { 
      if (connectors[0]) connect({ connector: connectors[0] }); 
      else alert("Install Wallet."); 
      return; 
    }

    if (currentChainId !== monadTestnet.id) { // <<! ตรวจสอบ Chain ID ก่อน
        setClaimMessage(`Wrong network! Please switch to Monad Testnet (ID: ${monadTestnet.id}). Your current network ID: ${currentChainId}`);
        if (switchChain) {
            switchChain({ chainId: monadTestnet.id });
        } else {
            alert(`Please switch your wallet to Monad Testnet (ID: ${monadTestnet.id}) to claim.`);
        }
        return;
    }

    if (!canClaimReward || hasClaimedThisSession || isClaiming) { 
      if(hasClaimedThisSession) setClaimMessage("Reward already processed!");
      return; 
    }
    if (simulateError) { 
      setClaimMessage(`Cannot claim (Simulate Err): ${simulateError.shortMessage || simulateError.message}`); 
      return; 
    }
    if (!simulateData?.request) { 
      setClaimMessage("Claim not ready. Simulation failed. Try again."); 
      if (!isSimulatingContractWrite) refetchSimulateContractWrite?.(); 
      return; 
    }
    if (!writeContractAsync) { 
      setClaimMessage("Claim function not available."); 
      return; 
    }

    setIsClaiming(true); setClaimMessage("Processing... Confirm in wallet."); setClaimTxHash(null);
    try {
      const hash = await writeContractAsync(simulateData.request);
      if (hash) { setClaimTxHash(hash); setClaimMessage("Transaction sent! Waiting..."); }
      else { setClaimMessage("Tx sent but no hash returned."); setIsClaiming(false); }
    } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    catch (err: any) { 
      console.error("Call writeCRAsync Err:", err); setClaimMessage(`Claim Init Err: ${err.shortMessage || err.message}`); setIsClaiming(false);
    }
  };

  useEffect(() => {
    if (isTransactionSuccess && claimTxHash) {
      setHasClaimedThisSession(true); setCanClaimReward(false);
      setClaimMessage(`Reward of ${REWARD_AMOUNT_DISPLAY} claimed! Tx: ${claimTxHash.substring(0,10)}...`);
      setIsClaiming(false);
    }
    if (isTransactionError && claimTxHash) {
      if (!claimMessage?.toLowerCase().includes("fail") && !claimMessage?.toLowerCase().includes("err")) {
          setClaimMessage(`Claim failed for Tx: ${claimTxHash.substring(0,10)}...`);
      }
      setIsClaiming(false);
    }
  }, [isTransactionSuccess, isTransactionError, claimTxHash, transactionReceipt, claimMessage]);


  useEffect(() => {
    if (dinoContainerRef.current && !dinoImageElementRef.current) {
        const img = document.createElement('img');
        img.alt = "Dino";
        img.style.width = `${DINO_IMAGE_DISPLAY_WIDTH}px`;
        img.style.height = `${DINO_IMAGE_DISPLAY_HEIGHT_STAND}px`;
        img.style.objectFit = 'contain';
        img.src = '/images/dino-assets/dino_run.png';
        dinoContainerRef.current.appendChild(img);
        dinoImageElementRef.current = img;
        dinoContainerRef.current.style.width = `${DINO_COLLISION_WIDTH}px`;
        dinoContainerRef.current.style.height = `${DINO_COLLISION_HEIGHT_STAND}px`;
        dinoContainerRef.current.style.bottom = `${DINO_BOTTOM_Y}px`;
        dinoContainerRef.current.style.left = `${DINO_START_X}px`;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.code === 'Space' || event.key === ' ' || event.code === 'ArrowUp') {
        event.preventDefault();
        if (!isPlayingRef.current) {
             if (gameOverMessageRef.current && gameOverMessageRef.current.style.display === 'flex' && !showClaimPopup) startGame();
             else if (!isPlayingRef.current && !showClaimPopup) startGame();
        } else jump();
      } else if (event.code === 'ArrowDown' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (isPlayingRef.current) crouch(true);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'ArrowDown' || event.key === 'ArrowDown') {
        event.preventDefault();
        if (isPlayingRef.current) crouch(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [startGame, jump, crouch, showClaimPopup]);

  useEffect(() => {
    if (dinoContainerRef.current && dinoImageElementRef.current) {
      if (isCrouching) {
        dinoContainerRef.current.style.height = `${DINO_COLLISION_HEIGHT_CROUCH}px`;
        dinoImageElementRef.current.src = '/images/dino-assets/dino_crouch.png';
        dinoImageElementRef.current.style.height = `${DINO_IMAGE_DISPLAY_HEIGHT_CROUCH}px`;
      } else {
        dinoContainerRef.current.style.height = `${DINO_COLLISION_HEIGHT_STAND}px`;
        dinoImageElementRef.current.src = '/images/dino-assets/dino_run.png';
        dinoImageElementRef.current.style.height = `${DINO_IMAGE_DISPLAY_HEIGHT_STAND}px`;
      }
      dinoImageElementRef.current.style.width = `${DINO_IMAGE_DISPLAY_WIDTH}px`;
    }
  }, [isCrouching]);

  useEffect(() => { if (!isPlaying) clearAllIntervalsAndTimers(); }, [isPlaying, clearAllIntervalsAndTimers]);
  useEffect(() => { return () => clearAllIntervalsAndTimers(); }, [clearAllIntervalsAndTimers]);

  // --- JSX สำหรับ Claim Popup Component ---
  const ClaimPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-white w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-yellow-400">Congratulations!</h2>
        <p className="mb-1">You scored {currentScore} points!</p>
        {claimMessage && (
          <p className={`text-sm my-2 px-2 ${isTransactionSuccess ? 'text-green-400' : (isTransactionError || simulateError || writeContractError || switchChainError ? 'text-red-400' : 'text-yellow-300')}`}>
            {claimMessage}
          </p>
        )}
        {switchChainError && <p className="text-xs text-red-500 mt-1">Switch Network Error: {switchChainError.shortMessage}</p>}
        {claimTxHash && (
             <p className="text-xs mt-1 mb-2">
                <a
                    href={`https://testnet.monadexplorer.com/tx/${claimTxHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                >
                    View Transaction
                </a>
            </p>
       )}
        {!hasClaimedThisSession ? (
          <button
            onClick={handleClaimReward}
            disabled={isClaiming || !simulateData?.request || isSimulatingContractWrite || !isConnected || isTransactionSuccess || (isConnected && currentChainId !== monadTestnet.id && !switchChain) }
            className="w-full mb-2 px-6 py-3 bg-green-500 hover:bg-green-700 disabled:bg-gray-500 text-white font-semibold rounded-lg shadow text-base"
          >
            {isSwitchingChain && currentChainId !== monadTestnet.id ? 'Switching Network...' : (isClaiming || isWriteContractLoading || isTransactionLoading || isSimulatingContractWrite ? 'Processing...' : `Claim ${REWARD_AMOUNT_DISPLAY}!`)}
          </button>
        ) : (
            <p className="text-green-400 mb-2 text-sm">Reward already processed!</p>
        )}
        {isConnected && currentChainId !== monadTestnet.id && canClaimReward && !hasClaimedThisSession && (
            <button onClick={() => switchChain?.({ chainId: monadTestnet.id })} disabled={isSwitchingChain} className="w-full mt-2 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow">
                {isSwitchingChain ? 'Switching...' : 'Switch to Monad Testnet'}
            </button>
        )}
        <button
          onClick={() => {
            setShowClaimPopup(false);
            if(isTransactionSuccess) setHasClaimedThisSession(true);
          }}
          className="w-full mt-2 px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow text-base"
        >
          Close
        </button>
         {!isConnected && canClaimReward && !hasClaimedThisSession && <p className="text-red-400 text-xs mt-2">Please connect your wallet to claim.</p>}
      </div>
    </div>
  );
  // --- สิ้นสุด JSX สำหรับ Claim Popup Component ---

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-gray-800 outline-none" tabIndex={0}>
      <div className="absolute top-4 right-4 z-10">
        {isConnected ? (
          <div className="flex items-center space-x-2 bg-gray-700 text-white p-2 rounded-lg shadow">
            <span className="text-xs">{`${userAddress?.substring(0, 6)}...${userAddress?.substring(userAddress.length - 4)}`}</span>
            <button onClick={() => disconnect()} className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs">Disconnect</button>
          </div>
        ) : (
          <button
            onClick={() => { if (connectors && connectors.length > 0 && connectors[0]) connect({ connector: connectors[0] }); }}
            disabled={isConnecting}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        )}
        {connectError && <p className="text-xs text-red-500 mt-1">{connectError.shortMessage || connectError.message}</p>}
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-center text-blue-600 mb-6">Monad Run</h1>
      <div id="gameArea" ref={gameAreaRef} className="relative bg-white border-4 border-gray-700 overflow-hidden shadow-lg" style={{ width: `${GAME_AREA_WIDTH}px`, height: `${GAME_AREA_HEIGHT}px` }}>
        <div ref={dinoContainerRef} id="dino" className="absolute" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          {/* <img> element is managed by dinoImageElementRef */}
        </div>
        <div ref={gameOverMessageRef} id="gameOverMessage" className="absolute inset-0 hidden flex-col items-center justify-center bg-black bg-opacity-75 text-white text-2xl font-bold p-4 text-center">
           <p>GAME OVER!</p>
           <p className="text-xl mt-2">Score: {currentScore}</p>
           <p className="text-base mt-4">Press SPACE to Play Again</p>
        </div>
      </div>
      <div className="mt-4 text-2xl font-semibold text-gray-700">Score: <span>{currentScore}</span></div>
      <div className="mt-2 text-md text-gray-600">Press SPACE/UP to Jump | Press & Hold DOWN to Crouch</div>
      <div className="mt-1 text-sm text-gray-500">Jump: Obstacles | Crouch: Birds</div>

      {showClaimPopup && <ClaimPopup />}
    </div>
  );
}
