'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const { userId } = useParams();
  const [chats, setChats] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [reported, setReported] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [showReport, setShowReport] = useState(false);

  const fetchChats = () => {
    fetch(`/api/chat/${userId}`)
      .then(res => res.json())
      .then(setChats);
  };

  useEffect(() => { fetchChats(); }, [userId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    await fetch(`/api/chat/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    setMessage('');
    fetchChats();
  };

  const handleReport = async () => {
    if (!reportReason.trim()) return;
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportedUserId: parseInt(userId as string), reason: reportReason }),
    });
    setReported(true);
    setShowReport(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Chat dengan User #{userId}</h1>
        <button
          onClick={() => setShowReport(!showReport)}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Laporkan
        </button>
      </div>

      {showReport && (
        <div className="bg-gray-800 p-4 rounded mb-4">
          <textarea
            className="w-full bg-gray-700 p-2 rounded mb-2"
            placeholder="Alasan laporan..."
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          />
          <button
            onClick={handleReport}
            className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded text-sm"
          >
            Kirim Laporan
          </button>
        </div>
      )}
      {reported && <p className="text-green-400 mb-4">Laporan terkirim.</p>}

      <div className="bg-gray-800 rounded p-4 h-80 overflow-y-auto mb-4">
        {chats.map(c => (
          <div key={c.id} className={`mb-2 ${c.senderId === (user as any)?.id ? 'text-right' : ''}`}>
            <p className="text-xs text-gray-400">{c.sender?.username}</p>
            <p className="bg-gray-700 inline-block p-2 rounded">{c.message}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-gray-700 p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan..."
        />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded">Kirim</button>
      </div>
    </div>
  );
}