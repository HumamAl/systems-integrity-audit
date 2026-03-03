interface AboutSectionProps {
  name: string;
  tagline: string;
  bio: string;
}

export function AboutSection({ name, tagline, bio }: AboutSectionProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold">{name}</h1>
      <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
      <p className="text-sm mt-4 leading-relaxed">{bio}</p>
    </div>
  );
}
