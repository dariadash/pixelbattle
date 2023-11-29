import React from 'react'
import styled from 'styled-components'

export const Loader = () => {
  return (
    <LoaderWrapper >
      <LoaderIcon />
    </LoaderWrapper>
  )
}

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoaderIcon = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #7314EC44
  border-radius: 50%;
  width: 36px;
  height: 36px;
  animation: spin 2s linear infinite;
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`