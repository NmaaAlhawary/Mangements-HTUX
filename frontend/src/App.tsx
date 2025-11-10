import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ChangeEventHandler, FormEvent, ReactNode } from 'react'
import './App.css'

export type VideoProject = {
  id: number
  project_name: string
  project_category: string
  project_date: string | null
  pathway: string
  module: string
  block: string
  video: string
  video_code: string
  video_title: string
  main_camera_man: string
  camera_assistant: string
  instructor_on_camera: string
  graphic_designer: string
  script_link: string
  screencast_link: string
  time_in: string | null
  time_out: string | null
  additional_info: string
}

export type FormState = {
  projectName: string
  projectCategory: string
  projectDate: string
  pathway: string
  module: string
  block: string
  video: string
  videoCode: string
  videoTitle: string
  mainCameraMan: string
  cameraAssistant: string
  instructorOnCamera: string
  graphicDesigner: string
  scriptLink: string
  screencastLink: string
  timeIn: string
  timeOut: string
  additionalInfo: string
}

const initialForm: FormState = {
  projectName: '',
  projectCategory: '',
  projectDate: '',
  pathway: '',
  module: '',
  block: '',
  video: '',
  videoCode: '',
  videoTitle: '',
  mainCameraMan: '',
  cameraAssistant: '',
  instructorOnCamera: '',
  graphicDesigner: '',
  scriptLink: '',
  screencastLink: '',
  timeIn: '',
  timeOut: '',
  additionalInfo: '',
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'
const CATEGORY_OPTIONS = [
  'School of Engineering Technology',
  'School of Social and Basic Science',
  'School of Mechanical Engineering',
  'School of Energy Engineering',
  'School of Computing and Informatics Student',
]
const CAMERA_OPTIONS = ['Motasem Ajloni', 'Suhaib Sarairah', 'Baraa', 'Omar Qudah']

const stripSpaces = (value: string) => value.replace(/\s+/g, '')

const formatDateSegment = (dateValue: string) => {
  if (!dateValue) return 'NoDate'
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return 'NoDate'
  const day = String(date.getDate()).padStart(2, '0')
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()
  return `${day}${month}${year}`
}

const buildVideoCode = (form: FormState, versionNumber: number) => {
  const partA = form.projectName || 'Project'
  const partB = stripSpaces(form.projectCategory) || 'Category'
  const partC = formatDateSegment(form.projectDate)
  const partD = stripSpaces(form.videoTitle) || 'Video'
  const partE = form.module || '0'
  const partF = form.block || '0'
  const partG = versionNumber || 1
  return `${partA}_${partB}_${partC}_${partD}_M${partE}_B${partF}_V${partG}`
}

function App() {
  const [formData, setFormData] = useState<FormState>(initialForm)
  const [projects, setProjects] = useState<VideoProject[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string>()
  const [successMessage, setSuccessMessage] = useState<string>()

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => a.project_name.localeCompare(b.project_name)),
    [projects],
  )

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/projects/`)
      if (!response.ok) {
        throw new Error('Unable to load projects')
      }
      const data = await response.json()
      setProjects(data)
      setError(undefined)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = evt.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleGenerateCode = () => {
    const code = buildVideoCode(formData, projects.length + 1)
    setFormData((prev) => ({ ...prev, videoCode: code }))
  }

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    setSubmitting(true)
    setSuccessMessage(undefined)
    setError(undefined)

    const payload = {
      project_name: formData.projectName,
      project_category: formData.projectCategory,
      project_date: formData.projectDate || null,
      pathway: formData.pathway,
      module: formData.module,
      block: formData.block,
      video: formData.video,
      video_code: formData.videoCode,
      video_title: formData.videoTitle,
      main_camera_man: formData.mainCameraMan,
      camera_assistant: formData.cameraAssistant,
      instructor_on_camera: formData.instructorOnCamera,
      graphic_designer: formData.graphicDesigner,
      script_link: formData.scriptLink,
      screencast_link: formData.screencastLink,
      time_in: formData.timeIn || null,
      time_out: formData.timeOut || null,
      additional_info: formData.additionalInfo,
    }

    try {
      const response = await fetch(`${API_URL}/projects/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Unable to save project. Please check the required fields.')
      }

      const newProject = (await response.json()) as VideoProject
      setProjects((prev) => [newProject, ...prev])
      setFormData(initialForm)
      setSuccessMessage('Project added successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <header>
        <div>
          <p className="eyebrow">Video Production Manager</p>
          <h1>Track and manage your video shooting and editing projects</h1>
        </div>
      </header>

      <main>
        <ProjectForm
          formData={formData}
          submitting={submitting}
          successMessage={successMessage}
          error={error}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onGenerateCode={handleGenerateCode}
        />
        <ProjectList projects={orderedProjects} loading={loading} onRefresh={fetchProjects} />
      </main>
    </div>
  )
}

type ProjectFormProps = {
  formData: FormState
  submitting: boolean
  successMessage?: string
  error?: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  onSubmit: (evt: FormEvent<HTMLFormElement>) => void
  onGenerateCode: () => void
}

const ProjectForm = ({ formData, submitting, successMessage, error, onChange, onSubmit, onGenerateCode }: ProjectFormProps) => (
  <section className="panel">
    <form className="project-form" onSubmit={onSubmit}>
      <FormSection title="Project Information">
        <FormRow>
          <TextInput label="Project Name *" name="projectName" value={formData.projectName} onChange={onChange} required />
          <SelectInput
            label="Project Category / School"
            name="projectCategory"
            value={formData.projectCategory}
            onChange={onChange}
            options={CATEGORY_OPTIONS}
            placeholder="Choose a school"
            required
          />
        </FormRow>
        <FormRow>
          <TextInput label="Date" name="projectDate" type="date" value={formData.projectDate} onChange={onChange} />
          <TextInput label="Pathway / Course Title" name="pathway" value={formData.pathway} onChange={onChange} />
        </FormRow>
      </FormSection>

      <FormSection title="Video Details">
        <FormRow>
          <TextInput label="Module" name="module" value={formData.module} onChange={onChange} />
          <TextInput label="Block" name="block" value={formData.block} onChange={onChange} />
        </FormRow>
        <FormRow>
          <TextInput label="Video" name="video" value={formData.video} onChange={onChange} />
          <VideoCodeInput value={formData.videoCode} onGenerate={onGenerateCode} />
        </FormRow>
        <FormRow>
          <TextInput label="Video Title *" name="videoTitle" value={formData.videoTitle} onChange={onChange} required />
        </FormRow>
      </FormSection>

      <FormSection title="Team & Production">
        <FormRow>
          <SelectInput
            label="Main Camera Man"
            name="mainCameraMan"
            value={formData.mainCameraMan}
            onChange={onChange}
            options={CAMERA_OPTIONS}
            placeholder="Select main camera"
          />
          <TextInput label="Camera Man Assistant" name="cameraAssistant" value={formData.cameraAssistant} onChange={onChange} />
        </FormRow>
        <FormRow>
          <TextInput label="Instructor on Camera" name="instructorOnCamera" value={formData.instructorOnCamera} onChange={onChange} />
          <TextInput label="Graphic Designer" name="graphicDesigner" value={formData.graphicDesigner} onChange={onChange} />
        </FormRow>
      </FormSection>

      <FormSection title="Additional Information">
        <FormRow>
          <TextInput label="Script Link" name="scriptLink" value={formData.scriptLink} onChange={onChange} placeholder="https://..." />
          <TextInput
            label="Screencast"
            name="screencastLink"
            value={formData.screencastLink}
            onChange={onChange}
            placeholder="https://..."
          />
        </FormRow>
        <FormRow>
          <TextInput label="Time In" name="timeIn" type="time" value={formData.timeIn} onChange={onChange} />
          <TextInput label="Time Out" name="timeOut" type="time" value={formData.timeOut} onChange={onChange} />
        </FormRow>
        <FormRow>
          <TextArea label="Additional Notes" name="additionalInfo" value={formData.additionalInfo} onChange={onChange} rows={3} />
        </FormRow>
      </FormSection>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Adding Project...' : 'Add Project'}
        </button>
        {successMessage && <p className="success">{successMessage}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </form>
  </section>
)

type ProjectListProps = {
  projects: VideoProject[]
  loading: boolean
  onRefresh: () => void
}

const ProjectList = ({ projects, loading, onRefresh }: ProjectListProps) => (
  <section className="panel">
    <div className="list-header">
      <h2>Projects</h2>
      <button onClick={onRefresh} disabled={loading}>
        {loading ? 'Refreshing...' : 'Refresh'}
      </button>
    </div>

    {projects.length === 0 && !loading ? (
      <EmptyState />
    ) : (
      <ul className="project-list">
        {projects.map((project) => (
          <li key={project.id} className="project-card">
            <div className="project-card__heading">
              <h3>{project.project_name}</h3>
              <span>{project.project_category || 'Unassigned'}</span>
            </div>
            <dl>
              <ProjectMeta label="Video Title" value={project.video_title} />
              <ProjectMeta label="Video Code" value={project.video_code} />
              <ProjectMeta label="Module" value={project.module} />
              <ProjectMeta
                label="Team"
                value={
                  project.main_camera_man
                    ? `${project.main_camera_man}${project.camera_assistant ? ` · Asst: ${project.camera_assistant}` : ''}`
                    : project.camera_assistant
                      ? `Asst: ${project.camera_assistant}`
                      : 'Not assigned'
                }
              />
              <ProjectMeta
                label="Timeline"
                value={project.time_in && project.time_out ? `${project.time_in} → ${project.time_out}` : 'Not set'}
              />
            </dl>
          </li>
        ))}
      </ul>
    )}
  </section>
)

const ProjectMeta = ({ label, value }: { label: string; value: string | null }) => (
  <div>
    <dt>{label}</dt>
    <dd>{value || '—'}</dd>
  </div>
)

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  required?: boolean
}

type TextInputProps = FieldProps & {
  type?: string
  placeholder?: string
  readOnly?: boolean
}

const TextInput = ({ label, name, value, onChange, type = 'text', required, placeholder, readOnly }: TextInputProps) => (
  <label className="field">
    <span>{label}</span>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      readOnly={readOnly}
    />
  </label>
)

type TextAreaProps = FieldProps & {
  rows?: number
}

const TextArea = ({ label, name, value, onChange, rows = 4 }: TextAreaProps) => (
  <label className="field">
    <span>{label}</span>
    <textarea name={name} value={value} onChange={onChange} rows={rows} />
  </label>
)

type SelectInputProps = FieldProps & {
  options: string[]
  placeholder?: string
}

const SelectInput = ({ label, name, value, onChange, required, options, placeholder }: SelectInputProps) => (
  <label className="field">
    <span>{label}</span>
    <select name={name} value={value} onChange={onChange} required={required}>
      <option value="">{placeholder || 'Select an option'}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </label>
)

const VideoCodeInput = ({ value, onGenerate }: { value: string; onGenerate: () => void }) => (
  <label className="field">
    <span>Video Code</span>
    <div className="code-field">
      <input type="text" name="videoCode" value={value} readOnly />
      <button type="button" onClick={onGenerate}>
        Generate
      </button>
    </div>
  </label>
)

const FormSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <fieldset className="form-section">
    <legend>{title}</legend>
    {children}
  </fieldset>
)

const FormRow = ({ children }: { children: ReactNode }) => <div className="form-row">{children}</div>

const EmptyState = () => (
  <div className="empty-state">
    <h3>No projects added yet</h3>
    <p>Fill out the form above to add your first project.</p>
  </div>
)

export default App
