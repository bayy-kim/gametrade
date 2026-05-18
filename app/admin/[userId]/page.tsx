'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function AdminChatPage() {
  const params = useParams();
  const userId = params.userId as string;
  const [chats, setChats] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [receiverId, setReceiverId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`/api/admin/chat/${userId}`)
      .then(res => res.json())
      .then(setChats);
    fetch('/api/admin/users')
      .then(res => res.json())
      .then(setUsers);
  }, [userId]);

  const sendMessage = async () => {
    if (!receiverId || !message) return;
    await fetch(`/api/admin/chat/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: parseInt(receiverId), message }),
    });
    // refresh chat
    const res = await fetch(`/api/admin/chat/${userId}`);
    setChats(await res.json());
    setMessage('');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Chat sebagai User ID: {userId}</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-gray-800 p-4 rounded">
          <h2 className="font-bold mb-2">Kirim Pesan ke</h2>
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mb-2"
          >
            <option value="">Pilih user</option>
            {users.filter(u => u.id !== parseInt(userId)).map(u => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-700 p-2 rounded mb-2"
            placeholder="Pesan..."
          />
          <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded w-full">
            Kirim
          </button>
        </div>
        <div className="col-span-2 bg-gray-800 p-4 rounded h-96 overflow-y-auto">
          {chats.map(chat => (
            <div key={chat.id} className={`mb-2 ${chat.senderId === parseInt(userId) ? 'text-right' : ''}`}>
              <p className="text-xs text-gray-400">{chat.sender?.username} → {chat.receiver?.username}</p>
              <p className="bg-gray-700 inline-block p-2 rounded">{chat.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}