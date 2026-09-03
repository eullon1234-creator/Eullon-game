// src/components/modals/UpdateModal.tsx
import React from 'react';
import { 
  Download, Sparkles, X, ArrowUpCircle, Smartphone, Monitor, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { UpdateInfo, updateService } from '../../services/updateService';
import { useGame } from '../../context/GameContext';

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateInfo: UpdateInfo | null;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  isOpen,
  onClose,
  updateInfo,
}) => {
  const { settings } = useGame();
  const isDeathNote = settings.theme === 'death-note';

  if (!isOpen || !updateInfo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden animate-scale-up ${
          isDeathNote
            ? 'bg-death-900 border-death-crimson/50 text-death-parchment shadow-death-crimson/20'
            : 'bg-gamer-900 border-neon-cyan/40 text-slate-100 shadow-neon-cyan/20'
        }`}
      >
        {/* Header com Gradiente */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDeathNote 
            ? 'bg-death-950 border-death-crimson/30' 
            : 'bg-gamer-950/80 border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${
              isDeathNote ? 'bg-death-crimson/20 text-death-crimson' : 'bg-neon-cyan/20 text-neon-cyan'
            }`}>
              <ArrowUpCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isDeathNote ? 'bg-death-crimson text-white' : 'bg-neon-cyan text-gamer-950 font-black'
                }`}>
                  Nova Versão
                </span>
                <span className="text-xs text-slate-400">GitHub Releases</span>
              </div>
              <h2 className="text-lg font-black tracking-tight mt-0.5">
                Atualização Disponível
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Versão Atual vs Nova Versão */}
          <div className={`p-4 rounded-xl border flex items-center justify-between ${
            isDeathNote
              ? 'bg-death-950/60 border-death-parchment/10'
              : 'bg-gamer-950/60 border-slate-800'
          }`}>
            <div>
              <div className="text-xs text-slate-400">Sua Versão Atual</div>
              <div className="text-sm font-bold text-slate-300">
                v{updateInfo.currentVersion}
              </div>
            </div>

            <div className="text-xl">➔</div>

            <div className="text-right">
              <div className="text-xs text-neon-cyan font-semibold">Nova Versão</div>
              <div className="text-lg font-black text-neon-cyan">
                v{updateInfo.latestVersion}
              </div>
            </div>
          </div>

          {/* Notas de Lançamento */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              O que há de novo:
            </div>
            <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap border ${
              isDeathNote
                ? 'bg-death-950/40 border-death-crimson/20 text-death-parchment/90'
                : 'bg-gamer-950/40 border-slate-800/80 text-slate-300'
            }`}>
              {updateInfo.releaseNotes || 'Melhorias gerais de estabilidade, correções e novos jogos adicionados ao catálogo.'}
            </div>
          </div>

          {/* Dica para Android */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex gap-2.5 items-start text-xs text-blue-200">
            <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Como atualizar no Celular:</strong> Ao tocar em <strong>"Baixar APK Android"</strong>, o arquivo será baixado. Abra o arquivo baixado e confirme a atualização. <strong>Nenhum jogo salvo ou dado seu será perdido!</strong>
            </div>
          </div>
        </div>

        {/* Rodapé com Botões de Ação */}
        <div className={`p-5 border-t flex flex-col sm:flex-row gap-3 ${
          isDeathNote ? 'bg-death-950 border-death-crimson/30' : 'bg-gamer-950/80 border-slate-800'
        }`}>
          {/* Botão Android APK */}
          <button
            onClick={() => {
              updateService.downloadApk(updateInfo.apkUrl);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-lg ${
              isDeathNote
                ? 'bg-death-crimson hover:bg-red-700 text-white shadow-death-crimson/30'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-gamer-950 font-black shadow-emerald-500/20'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Baixar APK Android {updateInfo.apkSizeMb ? `(${updateInfo.apkSizeMb})` : ''}</span>
            <Download className="w-4 h-4" />
          </button>

          {/* Botão Windows EXE (se disponível) */}
          {updateInfo.exeUrl && (
            <button
              onClick={() => {
                updateService.downloadExe(updateInfo.exeUrl);
              }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="Baixar instalador para Computador Windows"
            >
              <Monitor className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Windows (.exe)</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-white transition-colors"
          >
            Depois
          </button>
        </div>
      </div>
    </div>
  );
};
