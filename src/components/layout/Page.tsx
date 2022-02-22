import Head from "next/head";
import React from "react";

type Props = {
  seoTitle?: string;
  children?: React.ReactNode;
};

export default function Page({ seoTitle, children }: Props) {
  let titleString = "Schedule";
  if (seoTitle) {
    titleString = "Schedule | " + seoTitle;
  }

  return (
    <>
      <Head>
        <title>{titleString}</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="description"
          content="Find the best time for a group to get together. Pangea Schedule is a free survey tool that is quick and easy to use."
        />
      </Head>
      {children}
    </>
  );
}
