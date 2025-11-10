import { Language } from './types';

export const translations = {
  [Language.ES]: {
    // Header
    companyName: 'CHEC-COL-ONE',
    welcomeMessage: 'Bienvenido al portal de aplicaciones',
    logout: 'Cerrar sesión',
    changePassword: 'Cambiar contraseña',
    userMenu: 'Menú de usuario',
    
    // Navegación
    applications: 'Aplicaciones',
    reports: 'Reportes',
    favorites: 'Favoritos',
    admin: 'Administración',
    users: 'Usuarios',
    
    // Módulos
    noFavorites: 'No tienes módulos favoritos',
    noModules: 'No hay módulos disponibles',
    addModule: 'Añadir módulo',
    editModule: 'Editar módulo',
    deleteModule: 'Eliminar módulo',
    
    // Formularios de módulos
    moduleName: 'Nombre del módulo',
    moduleNameEn: 'Nombre en inglés',
    moduleNameZh: 'Nombre en chino',
    moduleUrl: 'URL del módulo',
    moduleCategory: 'Categoría',
    moduleIcon: 'Icono',
    selectIcon: 'Seleccionar icono',
    searchIcons: 'Buscar iconos...',
    recommended: 'Recomendados',
    categories: 'Categorías',
    noResults: 'No se encontraron resultados',
    
    // Gestión de usuarios
    addUser: 'Añadir usuario',
    editUser: 'Editar usuario',
    deleteUser: 'Eliminar usuario',
    userName: 'Nombre completo',
    userEmail: 'Correo electrónico',
    userPassword: 'Contraseña',
    newPassword: 'Nueva contraseña',
    confirmPassword: 'Confirmar nueva contraseña',
    userRole: 'Rol',
    userCompany: 'Empresa',
    userDepartment: 'Departamento',
    userPhone: 'Teléfono',
    userActive: 'Usuario activo',
    searchUsers: 'Buscar usuarios...',
    filterUsers: 'Filtrar usuarios',
    
    // Roles de usuario
    // FIX: Renamed 'admin' to 'roleAdmin' to avoid conflict with navigation 'admin' key.
    roleAdmin: 'Administrador',
    coordinator: 'Coordinador',
    sst_specialist: 'Especialista SST',
    nurse: 'Enfermería',
    employee: 'Empleado',
    
    // Estados
    active: 'Activo',
    inactive: 'Inactivo',
    lastLogin: 'Último acceso',
    never: 'Nunca',
    
    // Acciones generales
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    create: 'Crear',
    update: 'Actualizar',
    search: 'Buscar',
    filter: 'Filtrar',
    
    // Confirmaciones
    confirmDelete: '¿Estás seguro de que deseas eliminar este elemento?',
    confirmDeleteMessage: 'Esta acción no se puede deshacer.',
    deleteModuleTitle: 'Eliminar módulo',
    deleteUserTitle: 'Eliminar usuario',
    
    // Validaciones
    required: 'Este campo es obligatorio',
    invalidEmail: 'Correo electrónico no válido',
    invalidUrl: 'URL no válida',
    passwordMinLength: 'La contraseña debe tener al menos 6 caracteres',
    passwordsDoNotMatch: 'Las contraseñas no coinciden',

    // Mensajes
    loading: 'Cargando...',
    saving: 'Guardando...',
    deleting: 'Eliminando...',
    success: 'Operación exitosa',
    error: 'Error',
    noUsersFound: 'No se encontraron usuarios',
    userCreatedSuccess: 'Usuario creado exitosamente',
    userUpdatedSuccess: 'Usuario actualizado exitosamente',
    userDeletedSuccess: 'Usuario eliminado exitosamente',
    passwordUpdatedSuccess: 'Contraseña actualizada exitosamente',
    
    // Filtros
    allRoles: 'Todos los roles',
    allCompanies: 'Todas las empresas',
    allDepartments: 'Todos los departamentos',
    showActive: 'Mostrar activos',
    showInactive: 'Mostrar inactivos',
    
    // Estadísticas
    totalUsers: 'Total de usuarios',
    activeUsers: 'Usuarios activos',
    usersByRole: 'Usuarios por rol',
    usersByCompany: 'Usuarios por empresa',
    recentLogins: 'Accesos recientes',
    
    // Favoritos
    addToFavorites: 'Añadir a favoritos',
    removeFromFavorites: 'Quitar de favoritos',

    // Footer
    footerRights: 'Todos los derechos reservados.',
    footerDevelopedBy: 'Desarrollado por AXA COLPATRIA - DATENOVA'
  },
  
  [Language.EN]: {
    // Header
    companyName: 'CHEC-COL-ONE',
    welcomeMessage: 'Welcome to the application portal',
    logout: 'Sign out',
    changePassword: 'Change Password',
    userMenu: 'User Menu',

    // Navigation
    applications: 'Applications',
    reports: 'Reports',
    favorites: 'Favorites',
    admin: 'Administration',
    users: 'Users',
    
    // Modules
    noFavorites: 'You have no favorite modules',
    noModules: 'No modules available',
    addModule: 'Add module',
    editModule: 'Edit module',
    deleteModule: 'Delete module',
    
    // Module forms
    moduleName: 'Module name',
    moduleNameEn: 'Name in English',
    moduleNameZh: 'Name in Chinese',
    moduleUrl: 'Module URL',
    moduleCategory: 'Category',
    moduleIcon: 'Icon',
    selectIcon: 'Select icon',
    searchIcons: 'Search icons...',
    recommended: 'Recommended',
    categories: 'Categories',
    noResults: 'No results found',
    
    // User management
    addUser: 'Add user',
    editUser: 'Edit user',
    deleteUser: 'Delete user',
    userName: 'Full name',
    userEmail: 'Email',
    userPassword: 'Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm New Password',
    userRole: 'Role',
    userCompany: 'Company',
    userDepartment: 'Department',
    userPhone: 'Phone',
    userActive: 'Active user',
    searchUsers: 'Search users...',
    filterUsers: 'Filter users',
    
    // User roles
    // FIX: Renamed 'admin' to 'roleAdmin' to avoid conflict with navigation 'admin' key.
    roleAdmin: 'Administrator',
    coordinator: 'Coordinator',
    sst_specialist: 'SST Specialist',
    nurse: 'Nurse',
    employee: 'Employee',
    
    // States
    active: 'Active',
    inactive: 'Inactive',
    lastLogin: 'Last login',
    never: 'Never',
    
    // General actions
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    create: 'Create',
    update: 'Update',
    search: 'Search',
    filter: 'Filter',
    
    // Confirmations
    confirmDelete: 'Are you sure you want to delete this item?',
    confirmDeleteMessage: 'This action cannot be undone.',
    deleteModuleTitle: 'Delete module',
    deleteUserTitle: 'Delete user',
    
    // Validations
    required: 'This field is required',
    invalidEmail: 'Invalid email',
    invalidUrl: 'Invalid URL',
    passwordMinLength: 'Password must be at least 6 characters',
    passwordsDoNotMatch: 'Passwords do not match',

    // Messages
    loading: 'Loading...',
    saving: 'Saving...',
    deleting: 'Deleting...',
    success: 'Operation successful',
    error: 'Error',
    noUsersFound: 'No users found',
    userCreatedSuccess: 'User created successfully',
    userUpdatedSuccess: 'User updated successfully',
    userDeletedSuccess: 'User deleted successfully',
    passwordUpdatedSuccess: 'Password updated successfully',
    
    // Filters
    allRoles: 'All roles',
    allCompanies: 'All companies',
    allDepartments: 'All departments',
    showActive: 'Show active',
    showInactive: 'Show inactive',
    
    // Statistics
    totalUsers: 'Total users',
    activeUsers: 'Active users',
    usersByRole: 'Users by role',
    usersByCompany: 'Users by company',
    recentLogins: 'Recent logins',
    
    // Favorites
    addToFavorites: 'Add to favorites',
    removeFromFavorites: 'Remove from favorites',
    
    // Footer
    footerRights: 'All rights reserved.',
    footerDevelopedBy: 'Developed by AXA COLPATRIA - DATENOVA'
  },
  
  [Language.ZH]: {
    // 标题
    companyName: 'CHEC-COL-ONE',
    welcomeMessage: '欢迎使用应用程序门户',
    logout: '登出',
    changePassword: '更改密码',
    userMenu: '用户菜单',

    // 导航
    applications: '应用程序',
    reports: '报告',
    favorites: '收藏夹',
    admin: '管理',
    users: '用户',
    
    // 模块
    noFavorites: '您没有收藏的模块',
    noModules: '没有可用的模块',
    addModule: '添加模块',
    editModule: '编辑模块',
    deleteModule: '删除模块',
    
    // 模块表单
    moduleName: '模块名称',
    moduleNameEn: '英文名称',
    moduleNameZh: '中文名称',
    moduleUrl: '模块网址',
    moduleCategory: '类别',
    moduleIcon: '图标',
    selectIcon: '选择图标',
    searchIcons: '搜索图标...',
    recommended: '推荐',
    categories: '类别',
    noResults: '未找到结果',
    
    // 用户管理
    addUser: '添加用户',
    editUser: '编辑用户',
    deleteUser: '删除用户',
    userName: '全名',
    userEmail: '电子邮件',
    userPassword: '密码',
    newPassword: '新密码',
    confirmPassword: '确认新密码',
    userRole: '角色',
    userCompany: '公司',
    userDepartment: '部门',
    userPhone: '电话',
    userActive: '活跃用户',
    searchUsers: '搜索用户...',
    filterUsers: '筛选用户',
    
    // 用户角色
    // FIX: Renamed 'admin' to 'roleAdmin' to avoid conflict with navigation 'admin' key.
    roleAdmin: '管理员',
    coordinator: '协调员',
    sst_specialist: 'SST专家',
    nurse: '护士',
    employee: '员工',
    
    // 状态
    active: '活跃',
    inactive: '非活跃',
    lastLogin: '最后登录',
    never: '从未',
    
    // 通用操作
    save: '保存',
    cancel: '取消',
    edit: '编辑',
    delete: '删除',
    create: '创建',
    update: '更新',
    search: '搜索',
    filter: '筛选',
    
    // 确认
    confirmDelete: '您确定要删除此项吗？',
    confirmDeleteMessage: '此操作无法撤消。',
    deleteModuleTitle: '删除模块',
    deleteUserTitle: '删除用户',
    
    // 验证
    required: '此字段为必填项',
    invalidEmail: '无效的电子邮件',
    invalidUrl: '无效的网址',
    passwordMinLength: '密码至少需要6个字符',
    passwordsDoNotMatch: '密码不匹配',

    // 消息
    loading: '加载中...',
    saving: '保存中...',
    deleting: '删除中...',
    success: '操作成功',
    error: '错误',
    noUsersFound: '未找到用户',
    userCreatedSuccess: '用户创建成功',
    userUpdatedSuccess: '用户更新成功',
    userDeletedSuccess: '用户删除成功',
    passwordUpdatedSuccess: '密码更新成功',
    
    // 筛选器
    allRoles: '所有角色',
    allCompanies: '所有公司',
    allDepartments: '所有部门',
    showActive: '显示活跃',
    showInactive: '显示非活跃',
    
    // 统计
    totalUsers: '总用户数',
    activeUsers: '活跃用户',
    usersByRole: '按角色分类的用户',
    usersByCompany: '按公司分类的用户',
    recentLogins: '最近登录',
    
    // 收藏夹
    addToFavorites: '添加到收藏夹',
    removeFromFavorites: '从收藏夹中删除',
    
    // Footer
    footerRights: '版权所有.',
    footerDevelopedBy: '由 AXA COLPATRIA - DATENOVA 开发'
  }
};