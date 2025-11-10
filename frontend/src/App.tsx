import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent, ChangeEventHandler, FormEvent, ReactNode } from 'react'
import './App.css'

type VideoProject = {
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

type FormState = {
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

  const handleChange = (evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = evt.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
        <section className="panel">
          <form className="project-form" onSubmit={handleSubmit}>
            <FormSection title="Project Information">
              <FormRow>
                <TextInput
                  label="Project Name *"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleChange}
                  required
                />
                <TextInput
                  label="Project Category / School"
                  name="projectCategory"
                  value={formData.projectCategory}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow>
                <TextInput
                  label="Date"
                  name="projectDate"
                  type="date"
                  value={formData.projectDate}
                  onChange={handleChange}
                />
                <TextInput
                  label="Pathway / Course Title"
                  name="pathway"
                  value={formData.pathway}
                  onChange={handleChange}
                />
              </FormRow>
            </FormSection>

            <FormSection title="Video Details">
              <FormRow>
                <TextInput label="Module" name="module" value={formData.module} onChange={handleChange} />
                <TextInput label="Block" name="block" value={formData.block} onChange={handleChange} />
              </FormRow>
              <FormRow>
                <TextInput label="Video" name="video" value={formData.video} onChange={handleChange} />
                <TextInput label="Video Code" name="videoCode" value={formData.videoCode} onChange={handleChange} />
              </FormRow>
              <FormRow>
                <TextInput
                  label="Video Title *"
                  name="videoTitle"
                  value={formData.videoTitle}
                  onChange={handleChange}
                  required
                />
              </FormRow>
            </FormSection>

            <FormSection title="Team & Production">
              <FormRow>
                <TextInput
                  label="Main Camera Man"
                  name="mainCameraMan"
                  value={formData.mainCameraMan}
                  onChange={handleChange}
                />
                <TextInput
                  label="Camera Man Assistant"
                  name="cameraAssistant"
                  value={formData.cameraAssistant}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow>
                <TextInput
                  label="Instructor on Camera"
                  name="instructorOnCamera"
                  value={formData.instructorOnCamera}
                  onChange={handleChange}
                />
                <TextInput
                  label="Graphic Designer"
                  name="graphicDesigner"
                  value={formData.graphicDesigner}
                  onChange={handleChange}
                />
              </FormRow>
            </FormSection>

            <FormSection title="Additional Information">
              <FormRow>
                <TextInput
                  label="Script Link"
                  name="scriptLink"
                  value={formData.scriptLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
                <TextInput
                  label="Screencast"
                  name="screencastLink"
                  value={formData.screencastLink}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </FormRow>
              <FormRow>
                <TextInput
                  label="Time In"
                  name="timeIn"
                  type="time"
                  value={formData.timeIn}
                  onChange={handleChange}
                />
                <TextInput
                  label="Time Out"
                  name="timeOut"
                  type="time"
                  value={formData.timeOut}
                  onChange={handleChange}
                />
              </FormRow>
              <FormRow>
                <TextArea
                  label="Additional Notes"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  rows={3}
                />
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

        <section className="panel">
          <div className="list-header">
            <h2>Projects</h2>
            <button onClick={fetchProjects} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {orderedProjects.length === 0 && !loading ? (
            <EmptyState />
          ) : (
            <ul className="project-list">
              {orderedProjects.map((project) => (
                <li key={project.id} className="project-card">
                  <div className="project-card__heading">
                    <h3>{project.project_name}</h3>
                    <span>{project.project_category || 'Unassigned'}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Video Title</dt>
                      <dd>{project.video_title || '—'}</dd>
                    </div>
                    <div>
                      <dt>Video Code</dt>
                      <dd>{project.video_code || '—'}</dd>
                    </div>
                    <div>
                      <dt>Module</dt>
                      <dd>{project.module || '—'}</dd>
                    </div>
                    <div>
                      <dt>Team</dt>
                      <dd>
                        {project.main_camera_man || 'Main camera N/A'}
                        {project.camera_assistant ? ` · Asst: ${project.camera_assistant}` : ''}
                      </dd>
                    </div>
                    <div>
                      <dt>Timeline</dt>
                      <dd>
                        {(project.time_in && project.time_out && `${project.time_in} → ${project.time_out}`) || 'Not set'}
                      </dd>
                    </div>
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  )
}

type FieldProps = {
  label: string
  name: string
  value: string
  onChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>
  required?: boolean
}

type TextInputProps = FieldProps & {
  type?: string
  placeholder?: string
}

const TextInput = ({ label, name, value, onChange, type = 'text', required, placeholder }: TextInputProps) => (
  <label className="field">
    <span>{label}</span>
    <input type={type} name={name} value={value} onChange={onChange} required={required} placeholder={placeholder} />
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
