import React from 'react';
import styles from './icons.module.scss';
import classNames from 'classnames';
import { ReactComponent as Logo } from '../../assets/me/logo.svg';
import { ReactComponent as Home } from '../../assets/me/home.svg';
import { ReactComponent as Mentors } from '../../assets/me/mentors.svg';

export default { title: 'Icons' };

const Icon = ({
  children,
  light = false
}) => (
  <div className={classNames([styles.icon, {[styles.dark]: light}])}>
    {children}
  </div>
)

export const me = () => (
  <div className={styles.icons}>
    <Icon light><Logo /></Icon>
    <Icon><Home /></Icon>
    <Icon><Mentors /></Icon>
  </div>
)