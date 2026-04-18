import { useState } from 'react';

interface Props {
  coverImageUrl: string | null;
  title: string;
  className?: string;
}

export default function BookCoverImage({ coverImageUrl, title, className = '' }: Props) {
  const [errored, setErrored] = useState(false);

  if (!coverImageUrl || errored) {
    return (
      <div
        className={`bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center ${className}`}
      >
        <span className="text-5xl select-none">📖</span>
      </div>
    );
  }

  return (
    <img
      src={coverImageUrl}
      alt={title}
      className={`object-cover ${className}`}
      onError={() => setErrored(true)}
      loading="lazy"
    />
  );
}
