import { useEffect } from "react";

import { Button, Icon, Tooltip } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import SyncedImages from "app/images/views/ImageList/SyncedImages";
import IntroCard from "app/intro/components/IntroCard";
import IntroSection from "app/intro/components/IntroSection";
import introURLs from "app/intro/urls";
import { actions as bootResourceActions } from "app/store/bootresource";
import bootResourceSelectors from "app/store/bootresource/selectors";

const ImagesIntro = (): JSX.Element => {
  const dispatch = useDispatch();
  const history = useHistory();
  const ubuntu = useSelector(bootResourceSelectors.ubuntu);
  const resources = useSelector(bootResourceSelectors.resources);

  useEffect(() => {
    dispatch(bootResourceActions.poll({ continuous: true }));

    return () => {
      dispatch(bootResourceActions.pollStop());
    };
  }, [dispatch]);

  const hasSources = (ubuntu?.sources || []).length > 0;
  const incomplete = !hasSources || resources.length === 0;

  return (
    <IntroSection loading={!ubuntu} windowTitle="Images">
      <IntroCard complete={!incomplete} title="Images">
        <SyncedImages className="u-no-padding--bottom" formInCard={false} />
      </IntroCard>
      <div className="u-align--right">
        <Button appearance="neutral" element={Link} to={introURLs.index}>
          Back
        </Button>
        <Button
          appearance="positive"
          data-test="images-intro-continue"
          disabled={incomplete}
          hasIcon
          onClick={() => history.push({ pathname: introURLs.success })}
        >
          Continue
          {incomplete && (
            <Tooltip
              className="u-nudge-right"
              message="At least one image and source must be configured to continue."
            >
              <Icon className="is-light" name="information" />
            </Tooltip>
          )}
        </Button>
      </div>
    </IntroSection>
  );
};

export default ImagesIntro;
