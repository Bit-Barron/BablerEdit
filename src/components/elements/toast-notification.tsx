import * as React from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert } from "@/components/ui/retroui/alert"

type NotificationType = "success" | "error" | "warning" | "info"
type NotificationPosition = "top-right" | "top-left" | "bottom-right" | "bottom-left" | "top-center" | "bottom-center"

interface Notification {
  id: string
  type: NotificationType
  title: string
  description?: string
  duration?: number
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id">) => void
  removeNotification: (id: string) => void
}

const NotificationContext = React.createContext<NotificationContextType | null>(null)

export function useNotification() {
  const context = React.useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotification must be used within a GlassNotificationProvider")
  }
  return context
}

export function GlassNotificationProvider({
  children,
  position = "bottom-right",
}: {
  children: React.ReactNode
  position?: NotificationPosition
}) {
  const [notifications, setNotifications] = React.useState<Notification[]>([])

  const addNotification = React.useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    setNotifications((prev) => [...prev, { ...notification, id }])

    if (notification.duration !== 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
      }, notification.duration || 5000)
    }
  }, [])

  const removeNotification = React.useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
      <GlassNotificationContainer position={position} />
    </NotificationContext.Provider>
  )
}

const typeConfig = {
  success: {
    icon: CheckCircle,
    gradient: "from-emerald-500/30 to-green-500/30",
    border: "border-emerald-400/30",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: AlertCircle,
    gradient: "from-red-500/30 to-rose-500/30",
    border: "border-red-400/30",
    iconColor: "text-red-400",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-amber-500/30 to-yellow-500/30",
    border: "border-amber-400/30",
    iconColor: "text-amber-400",
  },
  info: {
    icon: Info,
    gradient: "from-cyan-500/30 to-blue-500/30",
    border: "border-cyan-400/30",
    iconColor: "text-cyan-400",
  },
}

const positionStyles: Record<NotificationPosition, { container: string; animation: string }> = {
  "top-right": {
    container: "top-4 right-4",
    animation: "slide-in-from-right-full",
  },
  "top-left": {
    container: "top-4 left-4",
    animation: "slide-in-from-left-full",
  },
  "bottom-right": {
    container: "bottom-4 right-4",
    animation: "slide-in-from-right-full",
  },
  "bottom-left": {
    container: "bottom-4 left-4",
    animation: "slide-in-from-left-full",
  },
  "top-center": {
    container: "top-4 left-1/2 -translate-x-1/2",
    animation: "slide-in-from-top-full",
  },
  "bottom-center": {
    container: "bottom-4 left-1/2 -translate-x-1/2",
    animation: "slide-in-from-bottom-full",
  },
}

function GlassNotificationContainer({ position = "bottom-right" }: { position?: NotificationPosition }) {
  const { notifications, removeNotification } = useNotification()
  const positionConfig = positionStyles[position]

  return (
    <div
      className={cn("fixed z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none", positionConfig.container)}
      role="region"
      aria-label="Notifications"
    >
      {notifications.map((notification, index) => (
        <GlassNotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
          animationClass={positionConfig.animation}
          style={{
            transform: `scale(${1 - index * 0.02})`,
            opacity: 1 - index * 0.1,
          }}
        />
      ))}
    </div>
  )
}

interface GlassNotificationItemProps {
  notification: Notification
  onClose: () => void
  style?: React.CSSProperties
  animationClass?: string
}

function GlassNotificationItem({
  notification,
  onClose,
  style,
  animationClass = "slide-in-from-right-full",
}: GlassNotificationItemProps) {
  const config = typeConfig[notification.type]
  const Icon = config.icon
  const [progress, setProgress] = React.useState(100)
  const duration = notification.duration || 5000

  React.useEffect(() => {
    if (duration === 0) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 100)
        return newProgress <= 0 ? 0 : newProgress
      })
    }, 100)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div
      className={cn("pointer-events-auto animate-in fade-in duration-300", animationClass)}
      style={style}
    >
      <Alert status={notification.type} className="relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start gap-3">
          <Icon className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />

          <div className="flex-1 min-w-0">
            <Alert.Title>{notification.title}</Alert.Title>
            {notification.description && (
              <Alert.Description className="mt-1">
                {notification.description}
              </Alert.Description>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Dismiss notification"
            className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors -mt-1 -mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        {duration !== 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
            <div
              className="h-full transition-all duration-100 ease-linear bg-black/20"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}
      </Alert>
    </div>
  )
}

// Standalone notification component for demos
export function GlassNotification({
  type = "info",
  title,
  description,
  className,
}: {
  type?: NotificationType
  title: string
  description?: string
  className?: string
}) {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <Alert status={type} className={cn("shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]", className)}>
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <Alert.Title>{title}</Alert.Title>
          {description && <Alert.Description className="mt-1">{description}</Alert.Description>}
        </div>
      </div>
    </Alert>
  )
}

export { GlassNotificationItem }
export type { NotificationPosition }
