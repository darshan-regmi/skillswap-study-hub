
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import MessageChat from "@/components/chat/MessageChat";
import { toast } from "sonner";

interface Conversation {
  id: string;
  with: {
    id: string;
    name: string;
    photoURL?: string;
  };
  lastMessage: string;
  unread: number;
  updatedAt: Date;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { conversationId } = useParams<{ conversationId: string }>();

  useEffect(() => {
    if (!currentUser) return;

    const fetchConversations = async () => {
      try {
        const q = query(
          collection(db, "conversations"),
          where("participants", "array-contains", currentUser.uid),
          orderBy("updatedAt", "desc")
        );
        
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const conversationsPromises = snapshot.docs.map(async (doc) => {
            const data = doc.data();
            const otherUserId = data.participants.find(
              (uid: string) => uid !== currentUser.uid
            );
            
            // Get other user's info
            const userDoc = await getDocs(
              query(collection(db, "users"), where("uid", "==", otherUserId))
            );
            
            let userName = "Unknown User";
            let userPhoto = undefined;
            
            if (!userDoc.empty) {
              const userData = userDoc.docs[0].data();
              userName = userData.displayName;
              userPhoto = userData.photoURL;
            }
            
            // Get unread count
            const messagesQuery = query(
              collection(db, "conversations", doc.id, "messages"),
              where("senderId", "!=", currentUser.uid),
              where("read", "==", false)
            );
            
            const unreadDocs = await getDocs(messagesQuery);
            
            return {
              id: doc.id,
              with: {
                id: otherUserId,
                name: userName,
                photoURL: userPhoto,
              },
              lastMessage: data.lastMessage || "No messages yet",
              unread: unreadDocs.size,
              updatedAt: data.updatedAt?.toDate() || new Date(),
            };
          });
          
          const conversationsData = await Promise.all(conversationsPromises);
          setConversations(conversationsData);
          setLoading(false);
        }, (error) => {
          console.error("Error fetching conversations:", error);
          toast.error("Failed to load conversations");
          setLoading(false);
        });
        
        return () => unsubscribe();
      } catch (error) {
        console.error("Error setting up conversations listener:", error);
        toast.error("Failed to load conversations");
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [currentUser]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-8">
          <div className="flex h-96 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-4">
                <h2 className="font-semibold text-lg mb-4">Conversations</h2>
                
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {conversations.map((conversation) => (
                      <Link
                        key={conversation.id}
                        to={`/messages/${conversation.id}`}
                        className={`block p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                          conversationId === conversation.id ? "bg-gray-50 border-l-4 border-primary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {conversation.with.photoURL ? (
                              <img src={conversation.with.photoURL} alt={conversation.with.name} />
                            ) : (
                              <div className="bg-primary text-white flex items-center justify-center h-full text-lg font-semibold uppercase">
                                {conversation.with.name.charAt(0)}
                              </div>
                            )}
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <h3 className="font-medium truncate">{conversation.with.name}</h3>
                              <span className="text-xs text-gray-500 whitespace-nowrap">
                                {conversation.updatedAt.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {conversation.lastMessage}
                            </p>
                          </div>
                          {conversation.unread > 0 && (
                            <Badge>{conversation.unread}</Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Active Chat */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-0">
                {conversationId ? (
                  <MessageChat />
                ) : (
                  <div className="flex h-[500px] items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Your Messages</h3>
                      <p>Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
