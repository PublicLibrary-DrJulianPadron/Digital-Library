/**
 * Sidebar Configuration
 * 
 * Centralized menu item definitions with capability-based access control.
 * Items without a capability are visible to all authenticated users.
 */

import {
    Home, BookOpen, Clock, Calendar, Book, LibraryBig, Users,
    BookType, Languages, ScrollText, User
} from "lucide-react";
import { Capability } from '@/features/authentication/types/user_roles';
import type { MenuItem } from "@/common/components/ui/sidebar";

export const SIDEBAR_ITEMS: MenuItem[] = [
    // Navigation Group - Available to all users
    {
        group: "Navigation",
        title: "Home",
        url: "/",
        icon: Home,
        requiresAuth: false
    },
    {
        group: "Navigation",
        title: "Salas",
        url: "/salas",
        icon: BookOpen,
        requiresAuth: false
    },
    {
        group: "Navigation",
        title: "History",
        url: "/historia",
        icon: Clock,
        requiresAuth: false
    },

    // Administration Group - Requires specific capabilities
    {
        group: "Administration",
        title: "Room Booking",
        url: "/prestamo/sala",
        icon: Calendar,
        requiresAuth: true,
        capability: Capability.MANAGE_ROOMS
    },
    {
        group: "Administration",
        title: "Content Management",
        url: "",
        icon: Book,
        requiresAuth: true,
        capability: Capability.MANAGE_CONTENT,
        children: [
            { title: "Collection", url: "/gestion/coleccion", icon: LibraryBig, requiresAuth: true, capability: Capability.MANAGE_CONTENT },
            { title: "Genres", url: "/gestion/generos", icon: BookType, requiresAuth: true, capability: Capability.MANAGE_CONTENT },
            { title: "Languages", url: "/gestion/lenguajes", icon: Languages, requiresAuth: true, capability: Capability.MANAGE_CONTENT },
            { title: "Materials", url: "/gestion/materiales", icon: ScrollText, requiresAuth: true, capability: Capability.MANAGE_CONTENT },
            { title: "Authors", url: "/gestion/autores", icon: User, requiresAuth: true, capability: Capability.MANAGE_CONTENT },
        ]
    },
    {
        group: "Administration",
        title: "User Management",
        url: "/gestion/usuarios",
        icon: Users,
        requiresAuth: true,
        capability: Capability.MANAGE_USERS
    },
];
