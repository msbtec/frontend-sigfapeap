import styled from 'styled-components';

export const StyledModal = styled.div`
    .close, .submit {
        margin: 0 3px;
        padding: 7px 14px;
        border-radius: 5px;
        font-size: 12px;
        font-weight: 500 !important;
        transition: all 0.2s !important;
        line-height: 1.6;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
            cursor: pointer;
            filter: brightness(90%)
        }
    }

    .close {
        border: 1px solid transparent;
        color: #333333c9;
        background: none;
    }

    .submit {
        cursor: pointer;
        background-color: #1bbc9b;
        border: 1px solid #1bbc9b;
        color: #fff !important;
        margin-top: 20px;
    }

`;
