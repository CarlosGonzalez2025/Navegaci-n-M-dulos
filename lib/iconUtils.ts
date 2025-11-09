import * as HeroIcons from '@heroicons/react/24/outline';

// Lista todos los iconos disponibles
export const getAvailableIcons = (): string[] => {
  return Object.keys(HeroIcons).sort();
};

// Obtiene iconos categorizados por tema
export const getCategorizedIcons = () => {
  const icons = getAvailableIcons();
  
  return {
    // Aplicaciones y tecnología
    apps: icons.filter(name => 
      /^(Computer|Device|Phone|Tablet|Tv|Desktop|Mobile|Laptop|Server|Cloud|Globe|Link|Code|Command|Terminal|Window|Application)/.test(name)
    ),
    
    // Documentos y archivos
    documents: icons.filter(name => 
      /^(Document|Paper|Folder|Archive|Inbox|Clipboard|Book|Academic|Library|Collection)/.test(name)
    ),
    
    // Comunicación y social
    communication: icons.filter(name => 
      /^(Chat|Mail|Message|Phone|Video|Microphone|Speaker|Bell|Megaphone|At|Share|Users|User)/.test(name)
    ),
    
    // Comercio y finanzas
    business: icons.filter(name => 
      /^(Currency|Credit|Banknotes|Calculator|Chart|Presentation|Briefcase|Building|Office|Store|Shopping|Truck|Scale)/.test(name)
    ),
    
    // Seguridad y salud
    security: icons.filter(name => 
      /^(Shield|Lock|Key|Eye|Heart|Medical|Cross|Bandage|Bug|Warning|Exclamation|Information|Check|X)/.test(name)
    ),
    
    // Herramientas y configuración
    tools: icons.filter(name => 
      /^(Wrench|Hammer|Tool|Gear|Settings|Adjustments|Puzzle|Cube|Square|Circle|Triangle|Rectangle|Hexagon|Pentagon|Diamond|Star|Sparkles|Magic|Wand|Scissors|Paperclip|Pin|Tag|Flag|Bookmark|Clock|Calendar|Map|Location|Navigation)/.test(name)
    ),
    
    // Multimedia
    media: icons.filter(name => 
      /^(Photo|Image|Camera|Film|Video|Music|Sound|Volume|Play|Pause|Stop|Forward|Backward|Record|Mic)/.test(name)
    ),
    
    // Interfaces y navegación
    interface: icons.filter(name => 
      /^(Home|Menu|Bars|Grid|List|Table|View|Search|Filter|Sort|Arrow|Chevron|Plus|Minus|Equals|Divide|Percent|Hash|Question|Info|Help|Support|Lifebuoy|Face|Emoji)/.test(name)
    )
  };
};

// Valida si un icono existe
export const isValidIcon = (iconName: string): boolean => {
  const normalizedName = iconName.endsWith('Icon') ? iconName : `${iconName}Icon`;
  return normalizedName in HeroIcons;
};

// Normaliza el nombre del icono
export const normalizeIconName = (iconName: string): string => {
  return iconName.endsWith('Icon') ? iconName : `${iconName}Icon`;
};

// Obtiene sugerencias de iconos basadas en palabras clave
export const getSuggestedIcons = (keyword: string): string[] => {
  const icons = getAvailableIcons();
  const lowerKeyword = keyword.toLowerCase();
  
  return icons.filter(iconName => {
    const lowerIconName = iconName.toLowerCase();
    return lowerIconName.includes(lowerKeyword) || 
           lowerIconName.includes(lowerKeyword.replace(/s$/, '')) || // singular
           lowerKeyword.includes(lowerIconName.replace('icon', '').toLowerCase());
  }).slice(0, 10); // Limitar a 10 sugerencias
};

// Iconos recomendados para módulos comunes de SST
export const getSSTRecommendedIcons = () => {
  return {
    // Módulos de seguridad
    safety: ['ShieldCheckIcon', 'ExclamationTriangleIcon', 'EyeIcon', 'LockClosedIcon'],
    
    // Módulos de salud
    health: ['HeartIcon', 'UserIcon', 'ClipboardDocumentCheckIcon', 'BeakerIcon'],
    
    // Módulos de empleados
    employees: ['UsersIcon', 'UserGroupIcon', 'IdentificationIcon', 'AcademicCapIcon'],
    
    // Módulos de reportes
    reports: ['DocumentTextIcon', 'ChartBarIcon', 'PresentationChartBarIcon', 'DocumentChartBarIcon'],
    
    // Módulos de administración
    admin: ['CogIcon', 'WrenchScrewdriverIcon', 'AdjustmentsHorizontalIcon', 'BuildingOfficeIcon'],
    
    // Módulos de auditoría
    audit: ['MagnifyingGlassIcon', 'DocumentMagnifyingGlassIcon', 'EyeIcon', 'ClipboardDocumentListIcon'],
    
    // Módulos de capacitación
    training: ['AcademicCapIcon', 'BookOpenIcon', 'PresentationChartLineIcon', 'VideoCameraIcon']
  };
};

// Función para mostrar todos los iconos (útil para desarrollo)
export const logAllIcons = () => {
  const categorized = getCategorizedIcons();
  
  console.group('📋 Iconos Disponibles por Categoría');
  Object.entries(categorized).forEach(([category, icons]) => {
    console.group(`${category.charAt(0).toUpperCase() + category.slice(1)} (${icons.length})`);
    icons.forEach(icon => console.log(`• ${icon}`));
    console.groupEnd();
  });
  console.groupEnd();
  
  console.log(`\n📊 Total de iconos disponibles: ${getAvailableIcons().length}`);
};