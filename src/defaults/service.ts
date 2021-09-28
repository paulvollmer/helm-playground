export const serviceFilename = "service.yaml"

export const serviceContent = `apiVersion: v1
kind: Service
metadata:
  name: {{ include "sample.fullname" . }}
  labels:
    {{- include "sample.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
    - port: {{ .Values.service.port }}
      targetPort: http
      protocol: TCP
      name: http
  selector:
    {{- include "sample.selectorLabels" . | nindent 4 }}
`
