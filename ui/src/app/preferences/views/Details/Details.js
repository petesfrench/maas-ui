import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

import { auth as authActions } from "app/base/actions";
import { auth as authSelectors } from "app/base/selectors";
import { useAddMessage } from "app/base/hooks";
import { user as userActions } from "app/base/actions";
import { user as userSelectors } from "app/base/selectors";
import Col from "app/base/components/Col";
import DetailsButtons from "./DetailsButtons";
import Row from "app/base/components/Row";
import UserForm from "app/base/components/UserForm";

export const Details = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(authSelectors.get);
  const usersSaved = useSelector(userSelectors.saved);
  const authUserSaved = useSelector(authSelectors.saved);
  const [passwordChanged, setPasswordChanged] = useState(false);

  useAddMessage(
    usersSaved && (!passwordChanged || authUserSaved),
    () => {
      dispatch(authActions.cleanup());
      return userActions.cleanup();
    },
    "Your details were updated successfully"
  );

  useEffect(() => {
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(authActions.cleanup());
      dispatch(userActions.cleanup());
    };
  }, [dispatch]);

  return (
    <Row>
      <Col size="4">
        <UserForm
          buttons={DetailsButtons}
          includeCurrentPassword
          includeUserType={false}
          onSave={(params, values, editing) => {
            dispatch(userActions.update(params));
            let passwordChanged =
              values.old_password || values.password || values.passwordConfirm;
            if (passwordChanged) {
              passwordChanged = true;
              dispatch(
                authActions.changePassword({
                  old_password: values.old_password,
                  new_password1: values.password,
                  new_password2: values.passwordConfirm
                })
              );
            }
            setPasswordChanged(passwordChanged);
          }}
          user={authUser}
        />
      </Col>
    </Row>
  );
};

export default Details;