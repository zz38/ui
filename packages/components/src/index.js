import bootstrap from './bootstrap';
import { I18N_DOMAIN_COMPONENTS, CIRCULAR_PROGRESS_SIZE } from './constants';
import {
	Action,
	Actions,
	ActionButton,
	ActionDropdown,
	ActionFile,
	ActionIconToggle,
	ActionSplitDropdown,
} from './Actions';
import ActionBar from './ActionBar';
import ActionList from './ActionList';
import AppLoader from './AppLoader';
import Notification from './Notification';
import HeaderBar from './HeaderBar';
import HttpError from './HttpError';
import Badge from './Badge';
import Breadcrumbs from './Breadcrumbs';
import CircularProgress from './CircularProgress';
import CollapsiblePanel from './CollapsiblePanel';
import ConfirmDialog from './ConfirmDialog';
import DataMapper from './DataMapper';
import Datalist from './Datalist';
import Dialog from './Dialog';
import Drawer from './Drawer';
import Emphasis from './Emphasis';
import Enumeration from './Enumeration';
import FilterBar from './FilterBar';
import ListView from './ListView';
import TreeView from './TreeView';
import Icon from './Icon';
import IconsProvider from './IconsProvider';
import JSONSchemaRenderer from './JSONSchemaRenderer';
import Layout from './Layout';
import List from './List';
import Loader from './Loader';
import ObjectViewer from './ObjectViewer';
import Progress from './Progress';
import Skeleton from './Skeleton';
import SidePanel from './SidePanel';
import { Status } from './Status';
import SubHeaderBar from './SubHeaderBar';
import TabBar from './TabBar';
import {
	DataAccessorWithSorterAndFilter,
	DraggableComponent,
	Sorter,
	SorterHeaderRenderer,
	SortOrder,
	Table,
	TableClickableCell,
	TableConfiguration,
	TableCell,
	TableHeader,
} from './Table';
import Toggle, { Checkbox } from './Toggle';
import TooltipTrigger from './TooltipTrigger';
import getTranslated from './TranslateWrapper';
import Typeahead from './Typeahead';
import VirtualizedList from './VirtualizedList';
import WithDrawer from './WithDrawer';
import Inject from './Inject';

const {
	Alert,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	ButtonGroup,
	ButtonToolbar,
	Carousel,
	CarouselItem,
	Clearfix,
	ControlLabel,
	Col,
	Collapse,
	Dropdown,
	DropdownButton,
	Fade,
	Form,
	FormControl,
	FormGroup,
	Glyphicon,
	Grid,
	HelpBlock,
	InputGroup,
	Jumbotron,
	Label,
	ListGroup,
	ListGroupItem,
	Media,
	MenuItem,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	Nav,
	Navbar,
	NavbarBrand,
	NavDropdown,
	NavItem,
	Overlay,
	OverlayTrigger,
	PageHeader,
	PageItem,
	Pager,
	Pagination,
	Panel,
	PanelGroup,
	Popover,
	ProgressBar,
	Radio,
	ResponsiveEmbed,
	Row,
	SafeAnchor,
	SplitButton,
	Tab,
	TabContainer,
	TabContent,
	TabPane,
	Tabs,
	Thumbnail,
	Tooltip,
	Well,
} = bootstrap;

const BootstrapBadge = bootstrap.Badge;
const BootstrapCheckbox = bootstrap.Checkbox;
const BootstrapTable = bootstrap.Table;

export {
	Action,
	Actions,
	ActionBar,
	ActionList,
	ActionButton,
	ActionDropdown,
	ActionFile,
	ActionIconToggle,
	ActionSplitDropdown,
	AppLoader,
	Badge,
	Breadcrumbs,
	Checkbox,
	CircularProgress,
	CollapsiblePanel,
	ConfirmDialog,
	DataMapper,
	Datalist,
	Dialog,
	Drawer,
	Emphasis,
	Enumeration,
	FilterBar,
	HeaderBar,
	HttpError,
	Icon,
	IconsProvider,
	Image,
	Inject,
	JSONSchemaRenderer,
	Layout,
	List,
	ListView,
	Loader,
	Notification,
	ObjectViewer,
	Progress,
	SidePanel,
	Status,
	SubHeaderBar,
	TabBar,
	Table,
	TableClickableCell,
	TableConfiguration,
	TableCell,
	TableHeader,
	DraggableComponent,
	Sorter,
	SorterHeaderRenderer,
	SortOrder,
	DataAccessorWithSorterAndFilter,
	Toggle,
	TooltipTrigger,
	TreeView,
	Typeahead,
	VirtualizedList,
	WithDrawer,
	getTranslated,
	I18N_DOMAIN_COMPONENTS,
	CIRCULAR_PROGRESS_SIZE,
	// bootstrap
	Alert,
	BootstrapBadge,
	BootstrapCheckbox,
	BootstrapTable,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	ButtonGroup,
	ButtonToolbar,
	Carousel,
	CarouselItem,
	Clearfix,
	ControlLabel,
	Col,
	Collapse,
	Dropdown,
	DropdownButton,
	Fade,
	Form,
	FormControl,
	FormGroup,
	Glyphicon,
	Grid,
	HelpBlock,
	InputGroup,
	Jumbotron,
	Label,
	ListGroup,
	ListGroupItem,
	Media,
	MenuItem,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	Nav,
	Navbar,
	NavbarBrand,
	NavDropdown,
	NavItem,
	Overlay,
	OverlayTrigger,
	PageHeader,
	PageItem,
	Pager,
	Pagination,
	Panel,
	PanelGroup,
	Popover,
	ProgressBar,
	Radio,
	ResponsiveEmbed,
	Row,
	SafeAnchor,
	Skeleton,
	SplitButton,
	Tab,
	TabContainer,
	TabContent,
	TabPane,
	Tabs,
	Thumbnail,
	Tooltip,
	Well,
};
