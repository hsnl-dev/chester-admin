import React from 'react';
import { Redirect, useLocation, useParams, useHistory } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from '../../components/FormFields/FormFields';
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from '../Login/Login.style';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import Logoimage from '../../assets/image/PickBazar.png';
import { request } from "../../utils/request";

interface RouteParams {
  user_id: string,
  token: string
};

const initialValues = {
  newpassword: '',
  repeatpassword: '',
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

const resetPasswordValidationSchema = () => {
  return Yup.object().shape({
    newpassword: Yup.string().required('This field is required!'),
    repeatpassword: Yup.string().required('This field is required').when("newpassword", {
      is: val => (val && val.length > 0 ? true : false),
      then: Yup.string().oneOf(
        [Yup.ref("newpassword")],
        "Both password need to be the same"
      )
    })
  });
};

export default () => {
  let history = useHistory();
  let params = useParams<RouteParams>();
  let resetPassword = async ({ newpassword, repeatpassword }, {resetForm}) => {
    try {
      const response = await request.post(`/password-reset/${params.user_id}/${params.token}`, {
        newpassword,
      });
      history.push('/login');
    } catch (err) {
      console.log(err);
      resetForm({});
    }
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={resetPassword}
          validationSchema={resetPasswordValidationSchema}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt='admin' />
                </LogoWrapper>
                <FormTitle>重新設定密碼</FormTitle>
              </FormFields>
              <FormFields>
                <FormLabel>新密碼</FormLabel>
                <Field
                  type='password'
                  name='newpassword'
                  component={MyInput}
                  placeholder='Enter new password'
                />
                {errors.newpassword && touched.newpassword && (
                  <Error>{errors.newpassword}</Error>
                )}
              </FormFields>
              <FormFields>
                <FormLabel>重複新密碼</FormLabel>
                <Field
                  type='password'
                  name='repeatpassword'
                  component={MyInput}
                  placeholder='Enter password again'
                />
                {errors.repeatpassword && touched.repeatpassword && (
                  <Error>{errors.repeatpassword}</Error>
                )}
              </FormFields>
              <Button
                type='submit'
                disabled={isSubmitting}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: '100%',
                      marginLeft: 'auto',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                    }),
                  },
                }}
              >
                Submit
              </Button>
            </Form>
          )}
        />
      </FormWrapper>
    </Wrapper>
  );
};