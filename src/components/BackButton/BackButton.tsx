import Link from 'next/link';
import { type FC } from 'react';

import styles from './BackButton.module.css';

type BackButtonProps = {
  href: string;
};

export const BackButton: FC<BackButtonProps> = ({ href }) => {
  return (
    <Link href={href} className={styles.link}>
      <span aria-hidden='true'>←</span>
      <span>Назад к списку</span>
    </Link>
  );
};
