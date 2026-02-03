import { ArrowRight } from "lucide-react";

interface ArticleCardProps {
  title: string;
  onClick: () => void;
}

export function ArticleCard({
  title,
  onClick,
}: ArticleCardProps) {
  return (
    <article
      onClick={onClick}
      className="group relative bg-white p-7 rounded-2xl border border-purple-100 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Purple gradient accent on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between gap-6">
        <div className="flex-1 space-y-3">
          <h2 className="text-xl font-semibold text-foreground leading-tight group-hover:text-violet-600 transition-colors duration-300">
            {title}
          </h2>
        </div>
        <div className="flex-shrink-0 mt-1">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center group-hover:from-violet-600 group-hover:to-purple-600 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300">
            <ArrowRight className="w-5 h-5 text-violet-600 group-hover:text-white transition-colors duration-300" />
          </div>
        </div>
      </div>
    </article>
  );
}

