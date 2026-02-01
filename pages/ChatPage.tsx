
import React, { useState, useEffect } from 'react';
import { 
    ChatHeader, 
    ChatInput, 
    MessageList, 
    WelcomeScreen, 
    BottomNav,
    InlineBudget
} from '../components/chat'; 
import AgentStatePanel from '../components/agent/AgentStatePanel';
import Sheet from '../components/ui/Sheet';
import StructuredControls from '../components/controls/StructuredControls';
import WalletPanel from '../components/wallet/WalletPanel';
import PlannedPurchasePanel from '../components/planned/PlannedPurchasePanel';
import { useChat } from '../hooks/useChat';
import { useWallet } from '../hooks/useWallet';
import { usePlannedPurchases } from '../hooks/usePlannedPurchases';
import { AuthProvider, useAuth } from '../lib/auth';
import { Target, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';

const ChatPageContent: React.FC = () => {
  const { plans, addPlan, removePlan } = usePlannedPurchases();
  const { cards, addCard, removeCard } = useWallet();
  
  // Initialize chat with a callback for agentic plan creation
  const { messages, isLoading, agentState, sendMessage, preferences, updatePreferences } = useChat({
    onPlanReady: (query, category, targetPrice) => {
      addPlan(query, category, targetPrice, preferences);
      // Optional: show the panel when the agent saves a plan
      setIsPlansOpen(true);
    }
  });
  
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  
  const { user, login, logout } = useAuth();
  
  const handleQuerySelect = (query: string) => {
    sendMessage(query);
  };

  const hasAlert = plans.some(p => p.status === 'price_drop');

  const handleManualPlan = (query: string, targetPrice: number) => {
    // For manual entry, we default category to "General" and let the background "daily check" task
    // (which uses the agent) update the category later based on the intent.
    addPlan(query, "General", targetPrice, preferences);
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg relative">
        {/* Header */}
        <ChatHeader 
            user={user} 
            cardCount={cards.length} 
            planCount={plans.length}
            hasAlert={hasAlert}
            onCardsClick={() => setIsWalletOpen(true)} 
            onPlansClick={() => setIsPlansOpen(true)}
            onProfileClick={user ? logout : login}
            onLogout={logout} 
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden relative flex flex-col">
            {/* Ambient background */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-primary-purple/5 blur-[100px]" />
            </div>

            {messages.length === 0 ? (
                <WelcomeScreen onQuerySelect={handleQuerySelect} />
            ) : (
                <>
                    <MessageList 
                        messages={messages} 
                        onAnswer={sendMessage}
                        cards={cards}
                    />
                    
                    {/* Floating Agent State */}
                    {agentState.phase !== 'idle' && (
                        <div className="absolute bottom-4 left-0 right-0 z-10 px-4 pointer-events-none">
                            <AgentStatePanel state={agentState} minimal={true} />
                        </div>
                    )}
                </>
            )}
        </div>

        {/* Input Area */}
        <div className="z-20 w-full bg-dark-bg border-t border-dark-border pb-safe">
            {/* Inline Controls (Budget) */}
            {messages.length > 0 && (
                <div className="px-4 pt-3 pb-1 flex justify-between items-center max-w-3xl mx-auto">
                     <InlineBudget 
                        value={preferences.budget.value}
                        min={preferences.budget.min}
                        max={preferences.budget.max}
                        isHardLimit={preferences.budget.isHardLimit}
                        onChange={(val) => updatePreferences({...preferences, budget: {...preferences.budget, value: val}})}
                        onHardLimitChange={(isHard) => updatePreferences({...preferences, budget: {...preferences.budget, isHardLimit: isHard}})}
                        disabled={isLoading}
                     />
                     
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => sendMessage("I want to save this as a Planned Purchase")}
                        className="text-text-secondary hover:text-primary-pink transition-all gap-1.5"
                     >
                        <Target size={14} />
                        <span className="text-[11px] font-bold uppercase tracking-wider">Planned Purchase</span>
                     </Button>
                </div>
            )}
            
            <ChatInput 
                onSend={sendMessage} 
                isLoading={isLoading} 
            />
        </div>

        {/* Planned Purchases Sheet */}
        <Sheet 
            isOpen={isPlansOpen} 
            onClose={() => setIsPlansOpen(false)} 
            title="Planned Purchases"
            side="right"
        >
            <PlannedPurchasePanel 
                plans={plans} 
                onRemove={removePlan} 
                onAddManual={handleManualPlan}
            />
        </Sheet>
        
        {/* Wallet Sheet */}
        <Sheet 
            isOpen={isWalletOpen} 
            onClose={() => setIsWalletOpen(false)} 
            title="Digital Wallet"
            side="right"
        >
            <WalletPanel 
                cards={cards} 
                onAddCard={addCard} 
                onRemoveCard={removeCard} 
            />
        </Sheet>
    </div>
  );
};

const ChatPage = () => (
    <AuthProvider>
        <ChatPageContent />
    </AuthProvider>
);

export default ChatPage;
