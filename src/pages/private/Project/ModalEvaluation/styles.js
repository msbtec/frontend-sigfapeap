import Modal from 'styled-react-modal';
import styled from 'styled-components';

export const Content = styled.div`
    /* background: #fff; */

    button{
        cursor: pointer;
        color: #fff;
        font-size: 16px;
        background: #b20710;
        height: 42px;
        border: 2px solid #b20710;
        border-radius: 5px;
        width: 40%;
        font-weight: bold;
        transition: all 0.2s;
    }

    button:hover{
        opacity: 0.98;
        box-shadow: 0 1px 6px 0 #b20710;
    }
`;

export const StyledModal = Modal.styled`
    max-width: 600px;
    width: 98%;
    height: auto;

    background-color: white;
    position: fixed;
    top: 0;
    margin: 1.75rem auto;
    border-radius: .3rem;

    @keyframes modalFade {
        from {transform: translateY(-50%);opacity: 0;}
        to {transform: translateY(0);opacity: 1;}
    }

    & {
        animation-name: modalFade;
        animation-duration: .3s;
    }

    .modal-header {
        display: -webkit-box;
        display: flex;
        -webkit-box-align: start;
        align-items: flex-start;
        -webkit-box-pack: justify;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid #dee2e6;
        border-top-left-radius: calc(.3rem - 1px);
        border-top-right-radius: calc(.3rem - 1px);
        color: #333;

        .modal-title {
            margin-bottom: 0;
            line-height: 1.6;
            font-size: 1.25rem;
            font-weight: normal;

        }

        button.close {
            padding: 0;
            background-color: transparent;
            border: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            align-self: center;
            cursor: pointer;
            font-size: 22px;
        }
    }

    .modal-body {
        // position: relative;
        // flex: 1 1 auto;
        padding: 1rem 1rem;
        max-height: 430px;
        overflow-y: auto;
    }

    .modal-footer {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        padding: .75rem;
        border-top: 1px solid #dee2e6;
        border-bottom-right-radius: calc(.3rem - 1px);
        border-bottom-left-radius: calc(.3rem - 1px);

        .close, .submit {
            margin: 0 3px;
            padding: 7px 14px;
            border-radius: 50px;
            font-size: 12px;
            font-weight: 500 !important;
            transition: all 0.2s !important;
            line-height: 1.6;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                filter: brightness(90%)
            }
        }

        .close {
            border: 1px solid transparent;
            color: #333333c9;
            background: none;
        }

        .submit {
            background-color: #1bbc9b;
            border: 1px solid #1bbc9b;
            color: #fff !important;
        }
    }
`;
