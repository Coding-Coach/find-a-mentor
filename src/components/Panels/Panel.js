import React from 'react';
import classNames from 'classnames';
import { bool } from 'prop-types';

/**
 * Usage:
 *
 *   <Panel>
 *     <PanelHeader>Some title here</PanelHeader>
 *     <PanelContent>
 *       <img src="something.png" />
 *       <div>
 *         <p>We should be able to add anything as the content</p>
 *       </div>
 *     </PanelContent>
 *     <PanelFooter>
 *        <small>you have x seconds to accept</small>
 *        <button>Click me!</button>
 *     </PanelFooter>
 *   </Panel>
 */

export function Panel({ children, floating }) {
  const css = classNames('w-full h-full bg-white rounded-sm', {
    'shadow-floating': floating,
  });

  return <div className={css}>{children}</div>;
}

Panel.propTypes = {
  floating: bool,
};

Panel.defaultProps = {
  floating: false,
};

export function PanelHeader({ children }) {
  return (
    <header className="px-6 pt-6 pb-5 border-b border-secondary-lightest min-h-20">
      <h2 className="text-primary text-2xl m-0 uppercase fjalla-one-regular font-titles font-normal tracking-wide">
        {children}
      </h2>
    </header>
  );
}

export function PanelContent({ children }) {
  return <div className="p-6 overflow-y-auto panel-content font-content">{children}</div>;
}

export function PanelFooter({ children }) {
  return (
    <footer className="h-16 py-4 px-6 flex justify-end border-t border-secondary-lightest">
      {children}
    </footer>
  );
}
