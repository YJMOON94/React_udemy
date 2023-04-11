import React, { useState, useEffect, useReducer, useContext, useRef } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";
import AuthContext from "../../store/auth-context";
import Input from "../UI/Input/Input";

const emailReducer = (state, action) => {
    if (action.type === "INPUT_EMAIL") {
        return { value: action.val, isValid: action.val.includes("@") };
    }
    if (action.type === "INPUT_BLUR") {
        return { value: state.value, isValid: state.value.includes("@") };
    }
    return { value: "", isValid: false };
};

const passReducer = (state, action) => {
    if (action.type === "INPUT_PASS") {
        return { value: action.val, isValid: action.val.trim().length > 6 };
    }
    if (action.type === "INPUT_BLUR") {
        return { value: state.value, isValid: state.value.trim().length > 6 };
    }
    return { value: "", isValid: false };
};

const Login = () => {
    const [formIsValid, setFormIsValid] = useState(false);

    const [emailState, dispatchEmail] = useReducer(emailReducer, {
        value: "",
        isValid: null,
    });
    const [passState, dispatchPass] = useReducer(passReducer, {
        value: "",
        isValid: null,
    });

    const authCtx = useContext(AuthContext);

    const emailInputRef = useRef();
    const passInputRef = useRef();

    useEffect(() => {
        console.log("EFFECT RUNNING");

        return () => {
            console.log("EFFECT CLEANUP");
        };
    }, []);

    const { isValid: emailIsValid } = emailState;
    const { isValid: passIsValid } = passState;

    useEffect(() => {
        const identifier = setTimeout(() => {
            console.log("Checking form validity!");
            setFormIsValid(emailIsValid && passIsValid);
        }, 500);

        return () => {
            console.log("CLEANUP");
            clearTimeout(identifier);
        };
    }, [emailIsValid, passIsValid]);

    const emailChangeHandler = (event) => {
        dispatchEmail({ type: "INPUT_EMAIL", val: event.target.value });

        // setFormIsValid(emailState.isValid && passState.isValid);
    };

    const passwordChangeHandler = (event) => {
        dispatchPass({ type: "INPUT_PASS", val: event.target.value });

        // setFormIsValid(emailState.isValid && passState.isValid);
    };

    const validateEmailHandler = () => {
        dispatchEmail({ type: "INPUT_BLUR" });
    };

    const validatePasswordHandler = () => {
        dispatchPass({ type: "INPUT_BLUR" });
    };

    const submitHandler = (event) => {
        event.preventDefault();
        if (formIsValid) {
            authCtx.onLogin(emailState.value, passState.value);
        } else if (!emailIsValid) {
            emailInputRef.current.focus();
        } else {
            passInputRef.current.focus();
        }
    };

    return (
        <Card className={classes.login}>
            <form onSubmit={submitHandler}>
                <Input
                    ref={emailInputRef}
                    id="email"
                    label="email"
                    type="email"
                    isValid={emailIsValid}
                    value={emailState.value}
                    onChange={emailChangeHandler}
                    onBlur={validateEmailHandler}
                />
                <Input
                    ref={passInputRef}
                    id="password"
                    label="password"
                    type="password"
                    isValid={passIsValid}
                    value={passState.value}
                    onChange={passwordChangeHandler}
                    onBlur={validatePasswordHandler}
                />
                <div className={classes.actions}>
                    <Button type="submit" className={classes.btn}>
                        Login
                    </Button>
                </div>
            </form>
        </Card>
    );
};

export default Login;
