import React from 'react';
import styled, {css} from 'styled-components';

const StyledLabel=styled.label`
    display:flex;
    align-items:center;
    width:6rem;
    font-weight:bold;
    font-size:1.5rem;

    ${props=>
        props.register&&
        css`
            width:7rem;
        `}
`;

const Label=props=><StyledLabel {...props}/>;

export default Label;