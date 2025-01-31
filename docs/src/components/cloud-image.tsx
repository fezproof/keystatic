import { getDefaultSrcSet } from '../utils';

type CloudImageProps = {
  src: string;
  alt?: string;
  height?: string | number;
  width?: string | number;
  srcSet?: string;
  sizes?: string;
  className?: string;
  caption?: string;
};

export default function CloudImage({
  src,
  alt,
  sizes,
  height,
  width,
  srcSet,
  className,
  caption,
}: CloudImageProps) {
  return caption ? (
    <figure>
      <img
        alt={alt || ''}
        src={src}
        height={height}
        width={width}
        srcSet={srcSet || getDefaultSrcSet({ src })}
        sizes={sizes}
        className={className}
      />
      <figcaption className="text-sm text-neutral-500 mb-2">
        {caption}
      </figcaption>
    </figure>
  ) : (
    <img
      alt={alt || ''}
      src={src}
      height={height}
      width={width}
      srcSet={srcSet || getDefaultSrcSet({ src })}
      sizes={sizes}
      className={className}
    />
  );
}
