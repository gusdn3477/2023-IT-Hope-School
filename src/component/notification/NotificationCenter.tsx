import { observer } from 'mobx-react-lite';
import styled, { css } from 'styled-components';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import { uiStore } from '../../stores/UIStore';

const Wrapper = styled.div`
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Toast = styled.div<{ type: 'success' | 'error' | 'info' }>`
  min-width: 240px;
  max-width: 360px;
  padding: 12px 16px;
  border-radius: 8px;
  font-family: 'Neo둥근모';
  color: #fff;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0,0,0,0.25);
  animation: fadeIn 0.25s ease;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  ${(p) => p.type === 'success' && css`background: linear-gradient(135deg,#2e7d32,#43a047);`}
  ${(p) => p.type === 'error' && css`background: linear-gradient(135deg,#c62828,#e53935);`}
  ${(p) => p.type === 'info' && css`background: linear-gradient(135deg,#1565c0,#1e88e5);`}
`;

const Message = styled.div`
  white-space: pre-line;
  font-size: 14px;
  padding-right: 4px;
`;

const NotificationCenter = observer(() => {
  if (uiStore.notifications.length === 0) return null;
  return (
    <Wrapper>
      {uiStore.notifications.map(n => (
        <Toast key={n.id} type={n.type}>
          <Message>{n.message}</Message>
          <IconButton size="small" onClick={() => uiStore.removeNotification(n.id)} style={{ color: '#fff' }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Toast>
      ))}
    </Wrapper>
  );
});

export default NotificationCenter;
