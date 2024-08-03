import styled from 'styled-components/native';

export const Container = styled.View`
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.GRAY_700};
    align-items: center;
    width: 100%;
    height: 100%;
`;

export const Title = styled.Text`
    color: #FFF;
    font-size: 32px;
`;