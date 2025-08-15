
import ChatBox from "../components/ChatBox";

export default function ChatPage(){
  return (
    <div style={{padding:'20px'}}>
      <h1>Chat with Nexora</h1>
      <p>Ask anything. Powered by Gemini (free tier).</p>
      <div style={{marginTop:12}}>
        <ChatBox embedded={true} />
      </div>
    </div>
  )
}
