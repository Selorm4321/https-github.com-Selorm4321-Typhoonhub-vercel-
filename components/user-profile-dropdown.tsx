export function UserProfileDropdown({ user, onLogout }: { user: any; onLogout: () => void }) {
    return (
        <div className="relative">
            <button onClick={onLogout} className="text-sm">Logout ({user.name})</button>
        </div>
    )
}
