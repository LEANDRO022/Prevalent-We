import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Fade from 'react-reveal/Fade';
import useWindowSize from '../../hooks/useWindowSize';

// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';

// core components
import Badge from './Badge';

import styles from './timelineStyle';

const useStyles = makeStyles(styles);

export default function Timeline(props) {
  const windowSize = useWindowSize();
  const classes = useStyles();
  const [size, setSize] = useState(true);
  const { stories, simple } = props;
  const timelineClass =
    classes.timeline +
    ' ' +
    cx({
      [classes.timelineSimple]: simple,
    });

  useEffect(() => {
    if (windowSize) {
      if (windowSize.width < 1024) {
        setSize(true);
      } else {
        setSize(false);
      }
    }
  }, [windowSize]);

  useEffect(() => {
    console.log('windowSize', windowSize);
    console.log('size', size);
  }, [windowSize, size]);

  return (
    <>
      {windowSize.width && (
        <ul className={timelineClass}>
          {stories.map((prop, key) => {
            const panelClasses =
              classes.timelinePanel +
              ' ' +
              cx({
                [classes.timelinePanelInverted]: prop.inverted || simple,
                [classes.timelineSimplePanel]: simple,
              });
            const timelineBadgeClasses =
              classes.timelineBadge +
              ' ' +
              classes[prop.badgeColor] +
              ' ' +
              cx({
                [classes.timelineSimpleBadge]: simple,
              });
            return (
              <li className={classes.item} key={key}>
                {prop.badgeIcon ? (
                  <div className={timelineBadgeClasses}>
                    <i className={prop.badgeIcon + ' ' + classes.badgeIcon} />
                  </div>
                ) : null}
                <Fade
                  right={size ? false : prop.inverted ? true : false}
                  left={size ? false : prop.inverted ? false : true}
                  top={size}
                  duration={500}
                >
                  <div className={panelClasses}>
                    {prop.title ? (
                      <div className={classes.timelineHeading}>
                        <Badge color={prop.titleColor}>{prop.title}</Badge>
                      </div>
                    ) : null}
                    <div className={classes.timelineBody}>{prop.body}</div>
                    {prop.footerTitle ? <h6 className={classes.footerTitle}>{prop.footerTitle}</h6> : null}
                    {prop.footer ? <hr className={classes.footerLine} /> : null}
                    {prop.footer ? <div className={classes.timelineFooter}>{prop.footer}</div> : null}
                  </div>
                </Fade>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

Timeline.propTypes = {
  stories: PropTypes.arrayOf(PropTypes.object).isRequired,
  simple: PropTypes.bool,
};
