'use client';

const Desktop = (props: React.ComponentProps<typeof Media>) => {
  return <Media greaterThanOrEqual={props.greaterThanOrEqual ?? 'md'} {...props} />;
};

const Mobile = (props: React.ComponentProps<typeof Media>) => {
  return <Media at={props.at ?? 'sm'} {...props} />;
};

export { MediaContextProvider, Media, createMediaStyle, Desktop, Mobile };
