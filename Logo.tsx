import {
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

import classes from './Logo.module.css';

type LogoProps = {
  href?: string;
  showText?: boolean;
} & UnstyledButtonProps;

const Logo = ({ href, showText = true, ...others }: LogoProps) => {
  return (
    <UnstyledButton
      className={classes.logo}
      component={Link}
      href={href || '/'}
      {...others}
    >
      <Group gap="xs">
        <Image
          src="/logo.webp"
          height={showText ? 32 : 24}
          width={showText ? 32 : 24}
          alt="design sparx logo"
          className={classes.logoImage}
        />
        {showText && <Text fw={700}>元素週期表</Text>}
      </Group>
    </UnstyledButton>
  );
};

export default Logo;
