import React from 'react';

import { Attachment } from '@leaa/common/entrys';
import { publicRuntimeConfig } from '@leaa/www/configs';

interface IProps {
  // attachment: Attachment;
  attachment: Pick<Attachment, 'uuid' | 'path' | 'title' | 'alt' | 'at2x' | 'pathAt2x' | 'height' | 'width'>;
  className?: string;
  lazy?: boolean;
}

export const RetinaImage = (props: IProps) => {
  const { attachment } = props;

  const at1x = `${publicRuntimeConfig.API_HOST}${attachment.path}`;
  const at2x = `${publicRuntimeConfig.API_HOST}${attachment.pathAt2x}`;

  const lazyProps = props.lazy
    ? {
        'data-src': at1x,
        'data-srcset': `${at2x} 2x`,
        className: 'swiper-lazy',
      }
    : {};

  return (
    <img
      alt={attachment.alt}
      title={attachment.title}
      className={props.className}
      srcSet={attachment.at2x ? `${at2x} 2x, ${at1x} 1x` : `${at1x} 1x`}
      src={`${at1x}`}
      {...lazyProps}
    />
  );
};