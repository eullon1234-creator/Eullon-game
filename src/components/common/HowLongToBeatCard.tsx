import React from 'react';
import { Clock, Trophy, Target, Sparkles, Plus, Minus } from 'lucide-react';
import { Game, TimeToBeat } from '../../types/game';
import { timeToBeatService } from '../../services/timeToBeatService';

interface HowLongToBeatSectionProps {
  game: Game;
  onUpdateHoursPlayed?: (hours: number) => void;
  isDeathNote?: boolean;
}

export const HowLongToBeatSection: React.FC<HowLongToBeatSectionProps> = ({
  game,
  onUpdateHoursPlayed,
  isDeathNote = false,
}) => {
  // Obtém o tempo salvo ou estima automaticamente
  const time: TimeToBeat = game.timeToBeat || timeToBeatService.getTimeToBeat(game.title);
  const hoursPlayed = game.hoursPlayed || 0;
  const mainTarget = time.main || 15;
  const progressPercent = Math.min(100, Math.round((hoursPlayed / mainTarget) * 100));

  const handleAdjustHours = (delta: number) => {
    if (!onUpdateHoursPlayed) return;
    const newHours = Math.max(0, hoursPlayed + delta);
    onUpdateHoursPlayed(newHours);
  };

  return (
    <div className={`p-4 rounded-2xl border space-y-4 ${
      isDeathNote 
        ? 'bg-death-900/90 border-red-950/70 shadow-glow-crimson' 
        : 'bg-gamer-850/80 border-slate-800'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            isDeathNote 
              ? 'bg-death-crimson/20 text-death-crimson border border-death-crimson/40' 
              : 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/30'
          }`}>
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>Tempo Médio para Zerar</span>
              <span className="text-[10px] text-slate-500 font-normal font-sans">(HowLongToBeat)</span>
            </h4>
            <span className="text-[11px] text-slate-400">Estimativas médias da comunidade</span>
          </div>
        </div>

        {/* Badge de categoria de duração */}
        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
          timeToBeatService.getDurationBadge(time.main).color
        }`}>
          {timeToBeatService.getDurationBadge(time.main).label}
        </span>
      </div>

      {/* 3 Cartões de Estimativa */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* História Principal */}
        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
          isDeathNote
            ? 'bg-black/40 border-red-950/60'
            : 'bg-gamer-900/90 border-slate-800 hover:border-neon-cyan/40'
        }`}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
            <Target className="w-3.5 h-3.5 text-neon-cyan" />
            <span className="hidden sm:inline">História</span>
            <span className="sm:hidden">Campanha</span>
          </div>
          <span className="text-base sm:text-lg font-black text-white font-mono">
            {time.main ? `${time.main}h` : '--'}
          </span>
          <span className="text-[10px] text-slate-500">Principal</span>
        </div>

        {/* História + Extras */}
        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
          isDeathNote
            ? 'bg-black/40 border-red-950/60'
            : 'bg-gamer-900/90 border-slate-800 hover:border-amber-500/40'
        }`}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Extras</span>
          </div>
          <span className="text-base sm:text-lg font-black text-amber-300 font-mono">
            {time.extra ? `${time.extra}h` : '--'}
          </span>
          <span className="text-[10px] text-slate-500">Secundárias</span>
        </div>

        {/* 100% / Platinar */}
        <div className={`p-2.5 sm:p-3 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
          isDeathNote
            ? 'bg-black/40 border-red-950/60'
            : 'bg-gamer-900/90 border-slate-800 hover:border-purple-500/40'
        }`}>
          <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 mb-1">
            <Trophy className="w-3.5 h-3.5 text-purple-400" />
            <span>100%</span>
          </div>
          <span className="text-base sm:text-lg font-black text-purple-300 font-mono">
            {time.completionist ? `${time.completionist}h` : '--'}
          </span>
          <span className="text-[10px] text-slate-500">Platina</span>
        </div>
      </div>

      {/* Progresso do Usuário (Horas Jogadas) */}
      {onUpdateHoursPlayed && (
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <span>Seu Progresso:</span>
              <span className="font-mono text-neon-cyan font-bold">{hoursPlayed}h jogadas</span>
              <span className="text-slate-500">de ~{mainTarget}h</span>
            </span>
            <span className={`font-mono font-bold text-[11px] ${
              progressPercent >= 100 ? 'text-emerald-400' : 'text-slate-400'
            }`}>
              {progressPercent}%
            </span>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full h-2 rounded-full bg-gamer-950 overflow-hidden border border-slate-800">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                progressPercent >= 100
                  ? 'bg-emerald-500 shadow-glow-emerald'
                  : isDeathNote
                    ? 'bg-death-crimson shadow-glow-crimson'
                    : 'bg-gradient-to-r from-neon-cyan to-blue-500 shadow-glow-cyan'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Botões Rápidos de Adicionar Horas */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Ajuste rápido de tempo:</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleAdjustHours(-1)}
                disabled={hoursPlayed <= 0}
                className="p-1 rounded-lg bg-gamer-900 hover:bg-gamer-800 disabled:opacity-40 text-slate-300 text-xs border border-slate-700 transition-colors"
                title="-1 hora"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => handleAdjustHours(1)}
                className="px-2 py-0.5 rounded-lg bg-gamer-900 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 text-white text-xs font-mono font-bold border border-slate-700 transition-all flex items-center gap-0.5"
                title="+1 hora"
              >
                <Plus className="w-3 h-3" />
                <span>1h</span>
              </button>
              <button
                type="button"
                onClick={() => handleAdjustHours(5)}
                className="px-2 py-0.5 rounded-lg bg-gamer-900 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 text-white text-xs font-mono font-bold border border-slate-700 transition-all flex items-center gap-0.5"
                title="+5 horas"
              >
                <Plus className="w-3 h-3" />
                <span>5h</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
