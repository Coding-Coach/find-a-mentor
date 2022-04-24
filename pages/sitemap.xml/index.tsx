import { GetServerSideProps } from 'next/types';
import { buildSitemap } from '../../src/utils/sitemapGenerator';

export default function Index() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'text/xml');
  const xml = await buildSitemap();
  res.write(xml);

  res.end();

  // Empty since we don't render anything
  return {
    props: {},
  };
};
