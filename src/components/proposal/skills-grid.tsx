interface SkillCategory {
  name: string;
  skills: string[];
}

interface SkillsGridProps {
  categories: SkillCategory[];
}

export function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => (
        <div key={category.name} className="rounded-lg border border-border/60 bg-card p-4 shadow-[0_1px_2px_0_rgb(0_0_0/0.03)]">
          <h3 className="text-sm font-medium mb-2">{category.name}</h3>
          <div className="flex flex-wrap gap-1.5">
            {category.skills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 text-xs rounded-md bg-primary/10 text-primary"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
