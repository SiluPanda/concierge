
import React, { useEffect, useRef, useState } from 'react';
import { Message, Question, Source, CreditCard } from '../../types';
import ReactMarkdown from 'react-markdown';
import { cn } from '../../lib/utils';
import ProductCard from './ProductCard';
import MapWidget from './MapWidget';
import { CheckCircle2, CircleDashed, ArrowRight, SendHorizontal, Search, ExternalLink } from 'lucide-react';
import Button from '../ui/Button';

interface MessageListProps {
  messages: Message[];
  agentStep?: any;
  onAnswer?: (answer: string) => void;
  cards?: CreditCard[];
}

interface QuestionCardProps {
  question: Question;
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, value, onChange, disabled }) => {
  return (
    <div className="bg-dark-card border border-dark-border p-3 rounded-xl animate-fade-in">
      <p className="text-xs font-medium text-white mb-2">{question.text}</p>
      
      {question.options && question.options.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {question.options.map((opt, idx) => {
            const isSelected = value === opt;
            return (
              <button 
                key={idx} 
                onClick={() => !disabled && onChange(opt)}
                disabled={disabled}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 cursor-pointer",
                  isSelected 
                    ? "bg-gradient-to-r from-primary-purple to-primary-pink text-white border-transparent shadow-md" 
                    : "bg-dark-elevated border-dark-border text-text-secondary hover:text-white hover:border-primary-purple/50 hover:bg-primary-purple/10",
                  disabled && !isSelected && "opacity-50 cursor-not-allowed hover:bg-dark-elevated hover:border-dark-border hover:text-text-secondary"
                )}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex gap-2">
           <input 
              type="text" 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              placeholder="Type your answer..."
              className="flex-1 bg-dark-elevated border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary-purple transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
           />
        </div>
      )}
    </div>
  );
};

const MessageBubble: React.FC<{ message: Message, isLast: boolean, onAnswer?: (answer: string) => void, cards?: CreditCard[] }> = ({ message, isLast, onAnswer, cards }) => {
  const isUser = message.role === 'user';
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isInteractive = isLast && !hasSubmitted && !!onAnswer;

  const handleAnswerChange = (questionId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: val }));
  };

  const handleSubmit = () => {
    if (!message.questions || !onAnswer) return;
    const responseParts = message.questions.map(q => {
      const ans = answers[q.id];
      return `${q.text}\n\n**${ans}**`; 
    });
    const combinedResponse = responseParts.join('\n\n');
    onAnswer(combinedResponse);
    setHasSubmitted(true);
  };

  const allQuestionsAnswered = message.questions?.every(q => {
     const val = answers[q.id];
     return val && val.trim().length > 0;
  });

  return (
    <div className={cn("flex flex-col w-full", isUser ? "items-end" : "items-start")}>
      
      {/* Steps */}
      {!isUser && message.steps && message.steps.length > 0 && (
        <div className="mb-2 pl-1 space-y-1">
          {message.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px] text-text-secondary">
              {step.status === 'active' || step.status === 'pending' ? (
                 <CircleDashed size={10} className="text-primary-purple animate-spin" />
              ) : (
                 <CheckCircle2 size={10} className="text-emerald-500" />
              )}
              <span className={step.status === 'completed' ? 'opacity-70' : 'font-medium text-primary-purple'}>{step.title || step.step}</span>
            </div>
          ))}
        </div>
      )}

      {/* Bubble */}
      <div 
        className={cn(
            "max-w-[85%] md:max-w-[75%] px-4 py-3 text-[14px] leading-relaxed shadow-sm",
            isUser 
                ? "rounded-[16px_16px_4px_16px] bg-gradient-to-br from-primary-purple to-primary-pink text-white" 
                : "rounded-[16px_16px_16px_4px] bg-dark-elevated border border-dark-border text-gray-100"
        )}
      >
        {message.isStreaming && !message.content ? (
          <div className="flex gap-1 h-5 items-center">
            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse"></span>
            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse delay-75"></span>
            <span className="w-1.5 h-1.5 bg-text-muted rounded-full animate-pulse delay-150"></span>
          </div>
        ) : (
            <div className="markdown-content">
                <ReactMarkdown 
                    components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 mb-2 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 mb-2 space-y-1" {...props} />,
                        a: ({node, ...props}) => <a className="text-primary-pink underline hover:text-white transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-white" {...props} />
                    }}
                >
                    {message.content}
                </ReactMarkdown>
            </div>
        )}
      </div>
      
      {/* Sources */}
      {!isUser && message.sources && message.sources.length > 0 && (
        <div className="mt-2 pl-1 w-full max-w-[85%] md:max-w-[75%]">
            <div className="flex flex-wrap gap-2">
                {message.sources.map((source, idx) => (
                    <a 
                        key={idx} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-dark-card border border-dark-border hover:border-primary-purple/50 text-[10px] text-text-secondary hover:text-white transition-all max-w-[200px]"
                        title={source.title}
                    >
                        <Search size={10} className="text-primary-purple" />
                        <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                        <ExternalLink size={8} className="opacity-50" />
                    </a>
                ))}
            </div>
        </div>
      )}

      {/* Map Widget (Local Stores) */}
      {!isUser && message.localStores && message.localStores.length > 0 && (
         <div className="w-full max-w-[85%] md:max-w-[75%] mt-2 animate-fade-in">
            <MapWidget stores={message.localStores} />
         </div>
      )}

      {/* Questions */}
      {!isUser && message.questions && message.questions.length > 0 && (
          <div className="mt-3 flex flex-col gap-2 w-full max-w-[85%] md:max-w-[75%]">
              {message.questions.map(q => (
                  <QuestionCard 
                    key={q.id} 
                    question={q} 
                    value={answers[q.id]}
                    onChange={(val) => handleAnswerChange(q.id, val)}
                    disabled={!isInteractive}
                  />
              ))}
              
              {isInteractive && (
                <div className="flex justify-end mt-2 animate-fade-in">
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={handleSubmit}
                    disabled={!allQuestionsAnswered}
                    className="gap-2"
                  >
                    <span>Submit Answers</span>
                    <SendHorizontal size={14} />
                  </Button>
                </div>
              )}
          </div>
      )}

      {/* Product Cards (Horizontal Scroll) */}
      {!isUser && message.products && message.products.length > 0 && (
        <div className="w-full mt-4 -mx-4 px-4 md:px-0 md:mx-0 overflow-hidden">
            <div className="flex gap-4 overflow-x-auto pb-6 px-1 snap-x custom-scrollbar">
                {message.products.map((product, index) => (
                    <div key={product.id} className="min-w-[260px] w-[260px] snap-center">
                        <ProductCard 
                            product={product} 
                            isTopPick={index === 0}
                            cards={cards}
                        />
                    </div>
                ))}
                {/* Spacer for right padding in scroll view */}
                <div className="w-1 shrink-0" />
            </div>
        </div>
      )}
    </div>
  );
};

export function MessageList({ messages, onAnswer, cards }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar max-w-4xl mx-auto w-full">
      {messages.map((message, index) => (
        <MessageBubble 
            key={message.id} 
            message={message} 
            onAnswer={onAnswer} 
            isLast={index === messages.length - 1}
            cards={cards}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default MessageList;
