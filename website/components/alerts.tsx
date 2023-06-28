import { Alert, AlertColor, Snackbar } from "@mui/material";

export type AlertEntry = {
  severity: AlertColor
  message: string
};

export default function AlertComponent({ alerts, setAlerts }: { alerts: AlertEntry[], setAlerts: any }) {

  const closeAlert = (alert: AlertEntry) => {
    return () => setAlerts(alerts.filter(a => alert != a));
  }

  return (
    <>
      {
        alerts.map((alert, index) => (
          <Snackbar 
            key={index} 
            open={true}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert severity={alert.severity} onClose={closeAlert(alert)} sx={{ width: '100%' }}>
              {alert.message}
            </Alert>
          </Snackbar>
        ))
      }
    </>
  );
}