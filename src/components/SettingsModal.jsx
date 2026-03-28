import React from 'react';
import { useGameStore } from '../engine/useGameStore';
import { Settings, X, Shield, Zap, Skull, Heart } from 'lucide-react';

const difficultyConfig = {
  casual: { name: 'Dễ (Casual)', icon: <Heart className="text-pink-400" />, desc: 'Kẻ địch yếu hơn, hồi phục nhanh hơn.' },
  normal: { name: 'Bình thường (Normal)', icon: <Shield className="text-blue-400" />, desc: 'Trải nghiệm cân bằng.' },
  hard: { name: 'Khó (Hard)', icon: <Zap className="text-amber-400" />, desc: 'Thử thách cho người chơi kinh nghiệm.' },
  ironman: { name: 'Sắt đá (Ironman)', icon: <Skull className="text-red-600" />, desc: 'Không có đường lùi. Chết là hết.' }
};

export default function SettingsModal({ onClose }) {
  const { difficulty, setDifficulty, resetGame } = useGameStore();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <Settings className="text-indigo-400" /> Cài Đặt Hệ Thống
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Difficulty Section */}
          <section className="space-y-4">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold">Độ Khó Trò Chơi</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(difficultyConfig).map(([id, cfg]) => (
                <button
                  key={id}
                  onClick={() => setDifficulty(id)}
                  className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    difficulty === id 
                    ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="mt-1">{cfg.icon}</div>
                  <div>
                    <div className="font-bold text-white text-sm">{cfg.name}</div>
                    <div className="text-[10px] text-gray-400 leading-tight mt-1">{cfg.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            {difficulty === 'ironman' && (
              <p className="text-[10px] text-red-400 italic font-medium">⚠️ Cảnh báo: Chế độ Sắt Đá sẽ xóa file lưu khi bạn tử vong.</p>
            )}
          </section>

          {/* Audio Section (Placeholder for future) */}
          <section className="space-y-4 opacity-50 cursor-not-allowed">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold">Âm Thanh & Hình Ảnh (Sắp ra mắt)</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span>Nhạc nền</span>
                <div className="w-10 h-5 bg-gray-700 rounded-full relative">
                   <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span>Hiệu ứng âm thanh</span>
                <div className="w-10 h-5 bg-gray-700 rounded-full relative">
                   <div className="absolute left-1 top-1 w-3 h-3 bg-gray-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Dangerous Zone */}
          <section className="pt-6 border-t border-white/5">
            <h3 className="text-sm uppercase tracking-widest text-red-500/70 font-bold mb-4">Vùng Nguy Hiểm</h3>
            <button
              onClick={() => {
                if (window.confirm("HÀNH ĐỘNG KHÔNG THỂ HOÀN TÁC: Bạn có chắc chắn muốn xóa tất cả dữ liệu lưu và bắt đầu lại?")) {
                  resetGame();
                }
              }}
              className="w-full p-3 bg-red-900/20 hover:bg-red-900/40 border border-red-500/30 rounded-xl text-red-200 text-sm font-bold transition-all"
            >
              🔥 Xóa Dữ Liệu & Đặt Lại Trò Chơi
            </button>
          </section>
        </div>

        <div className="p-6 bg-white/5 text-center">
            <p className="text-[10px] text-gray-500">Wandered Engine v1.5.0 - The Eternal Seventh Day</p>
        </div>
      </div>
    </div>
  );
}
