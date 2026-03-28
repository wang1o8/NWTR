import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import endingsData from '../data/endings.json';
import { Trophy, Calendar, Hash } from 'lucide-react';

export default function HallOfLegends({ onClose }) {
  const { endingsReached } = useGameStore();
  
  const history = (endingsReached || []).map(id => endingsData.endings.find(e => e.id === id)).filter(Boolean);

  return (
    <div className="hall-modal glass p-6 max-w-4xl w-full mx-auto mt-20 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500" />
      
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/5">
        <div>
          <h2 className="text-3xl font-black text-amber-500 italic uppercase tracking-tighter flex items-center gap-3">
            <Trophy size={32} /> Đền Thờ Huyền Thoại
          </h2>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1">Lịch sử các vòng lặp đã qua</p>
        </div>
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all">✕</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
        {history.length > 0 ? (
          history.map((ending, idx) => (
            <div key={idx} className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all cursor-default">
              <div className="absolute top-4 right-4 text-[10px] font-black text-white/20 group-hover:text-amber-500/40">LOOP #{idx + 1}</div>
              <h3 className="text-xl font-bold italic mb-2" style={{ color: ending.color }}>{ending.title}</h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 italic">"{ending.description}"</p>
              
              <div className="flex items-center gap-4 mt-4 text-[10px] font-black uppercase tracking-tighter text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> Chiến tích cổ</span>
                <span className="flex items-center gap-1"><Hash size={12} /> ID: {ending.id}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-20 text-center opacity-30">
            <Trophy size={64} className="mx-auto mb-4" />
            <p className="text-lg italic">Chưa có huyền thoại nào được ghi danh...</p>
            <p className="text-xs uppercase tracking-widest mt-2">Hãy hoàn thành trò chơi để mở khóa</p>
          </div>
        )}
      </div>
    </div>
  );
}
