import React from 'react';
import classNames from 'classnames';
import './Tag.css';

const Tag = ({ className, ...props }) => {
  return <button className={classNames('tag', className)} {...props} />;
};

export default Tag;
