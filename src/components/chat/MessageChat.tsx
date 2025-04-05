
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message, User } from "@/types";
import { toast } from "sonner";

const MessageChat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState<User | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  // Fetch conversation details
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    const fetchConversation = async () => {
      try {
        const convRef = doc(db, "conversations", conversationId);
        const convSnap = await getDoc(convRef);

        if (convSnap.exists()) {
          const convData = convSnap.data();
          const otherUserId = convData.participants.find((uid: string) => uid !== currentUser.uid);
          
          if (otherUserId) {
            const userRef = doc(db, "users", otherUserId);
            const userSnap = await getDoc(userRef);
            
            if (userSnap.exists()) {
              setOtherUser({
                id: userSnap.id,
                ...userSnap.data()
              } as User);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
        toast.error("Failed to load conversation");
      }
    };

    fetchConversation();
  }, [conversationId, currentUser]);

  // Subscribe to messages
  useEffect(() => {
    if (!conversationId || !currentUser) return;

    const q = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData: Message[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Message));
      
      setMessages(messageData);
      setLoading(false);
    }, (error) => {
      console.error("Error subscribing to messages:", error);
      toast.error("Failed to load messages");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [conversationId, currentUser]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversationId || !currentUser) return;
    
    setSending(true);
    try {
      const messageData = {
        senderId: currentUser.uid,
        content: newMessage.trim(),
        createdAt: serverTimestamp(),
        read: false
      };
      
      await addDoc(
        collection(db, "conversations", conversationId, "messages"), 
        messageData
      );
      
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[800px]">
      {/* Header */}
      {otherUser && (
        <div className="p-4 border-b flex items-center gap-3">
          <Avatar>
            {otherUser.photoURL ? (
              <img src={otherUser.photoURL} alt={otherUser.displayName} />
            ) : (
              <div className="bg-primary text-white flex items-center justify-center h-full text-lg font-semibold uppercase">
                {otherUser.displayName.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h3 className="font-semibold">{otherUser.displayName}</h3>
            <p className="text-sm text-gray-500">
              {otherUser.bio ? otherUser.bio.substring(0, 50) + (otherUser.bio.length > 50 ? '...' : '') : 'No bio'}
            </p>
          </div>
        </div>
      )}

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser?.uid;
            
            return (
              <div
                key={message.id}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/80' : 'text-gray-500'}`}>
                    {message.createdAt?.toDate ? message.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Sending...'}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messageEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={sendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !newMessage.trim()}>
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageChat;
