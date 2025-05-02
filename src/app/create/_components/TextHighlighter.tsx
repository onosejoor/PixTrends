export default function TextHighlighter({ text }: { text: string }) {
  const renderText = () => {
    const segments = text.split(/(#\w+)|(\bhttps?:\/\/\S+\b)/g);

    return segments.map((segment, index) => {
      if (!segment) return null;

      if (segment.startsWith("#")) {
        return (
          <span key={index} className="text-accent ">
            {segment}
          </span>
        );
      }

      if (segment.match(/^https?:\/\//)) {
        return (
          <a
            key={index}
            href={segment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent break-all"
          >
            {segment}
          </a>
        );
      }

      return (
        <span key={index} className="text-secondary">
          {segment}
        </span>
      );
    });
  };

  return <div className="whitespace-pre-wrap">{renderText()}</div>;
}
