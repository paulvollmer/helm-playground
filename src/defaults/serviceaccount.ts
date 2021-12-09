export const serviceaccountFilename = 'serviceaccount.yaml'

export const serviceaccountContent = `{{- if .Values.serviceAccount.create -}}
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {{ include "sample.serviceAccountName" . }}
  labels:
    {{- include "sample.labels" . | nindent 4 }}
  {{- with .Values.serviceAccount.annotations }}
  annotations:
    {{- toYaml . | nindent 4 }}
  {{- end }}
{{- end }}
`
