import Link from 'next/link';

import styles from './BackButton.module.css';

type BackButtonProps = {
  href: string;
};

export default function BackButton({ href }: BackButtonProps) {
  return (
    <Link href={href} className={styles.link}>
      <span aria-hidden='true'>←</span>
      <span>Назад к списку</span>
    </Link>
  );
}
