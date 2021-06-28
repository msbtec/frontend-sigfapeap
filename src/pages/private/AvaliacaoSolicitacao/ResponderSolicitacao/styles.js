import styled from 'styled-components';

export const StyledModal = styled.div`
    .close, .submit, .refuse {
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
        cursor: pointer;
        background-color: #3699ff;
        border: 1px solid #3699ff;
        color: #fff !important;
    }

    .refuse {
        cursor: pointer;
        background-color: #f00;
        border: 1px solid #f00;
        color: #fff !important;
    }

    .submit {
        cursor: pointer;
        background-color: #1bbc9b;
        border: 1px solid #1bbc9b;
        color: #fff !important;
        margin-top: 20px;
    }

`;
