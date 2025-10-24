import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";

interface MainButtonProps {
    icon: React.ReactNode;                // The icon component (e.g. <FaMap />)
    label: string;                        // The text label
    labelSmall?: string;
    to?: string;                          // Optional navigation path
    onClick?: () => void;                 // Optional custom click handler
    title?: string;                       // Tooltip text
    disabled?: boolean;                   // Disable button
    activeColor?: string;                 // Background when active
    defaultColor?: string;                // Background when inactive
    hideLabelOnSmall?: boolean;           // Hide text on small screens (default: true)
    hideIconOnSmall?: boolean;
    fontSizeSmall?: string;               // Optional font size override for small screens
    fontSizeLarge?: string;               // Optional font size override for large screens
    iconSmall?: string;
    iconLarge?: string;
    count?: number;                        // Optional badge number shown in the top-right corner
}

/**
 * MainButton component
 *
 * A reusable, responsive button component designed for consistent styling
 * across the app’s main navigation and actions.
 *
 * It supports icons, dynamic labels, navigation, and custom click handling.
 * The button adapts to small screens, optionally hiding or resizing its label and icon.
 *
 * @component
 *
 * @example
 * ```tsx
 * <MainButton
 *   icon={<FaMap />}                // React icon component (e.g., from react-icons)
 *   label="Kart"                    // Button text
 *   to="/map"                       // Optional: navigates to this route when clicked
 *   onClick={() => {}}              // Optional: custom click handler
 *   title="Åpne kartvisning"        // Tooltip shown on hover
 *   disabled={false}                // Optional: disables click & dims opacity
 *   activeColor="cyan"              // Background color when active
 *   defaultColor="#e0ffb2"          // Background color when inactive
 *   hideLabelOnSmall={true}         // Whether to hide text on small screens
 *   fontSizeSmall="1.25em"          // Font size when small screen
 *   fontSizeLarge="1.5em"           // Font size when large screen
 *   iconSmall="24px"                // Icon width/height when small screen
 *   iconLarge="32px"                // Icon width/height when large screen
 * />
 * ```
 */
export const MainButton: React.FC<MainButtonProps> = ({
    icon,
    label,
    labelSmall,
    to,
    onClick,
    title = label,
    disabled = false,
    activeColor = "cyan",
    defaultColor = "#e0ffb2",
    hideLabelOnSmall = true,
    hideIconOnSmall = false,
    fontSizeSmall = "1.25em",
    fontSizeLarge = "1.5em",
    iconSmall = "32px",
    iconLarge = "32px",
    count,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const isSmall = useIsSmallScreen();

    // Determine background color based on current route (if applicable)
    const isActive = to && location.pathname.includes(to);
    const backgroundColor = isActive ? activeColor : defaultColor;

    // Handle navigation or custom click
    const handleClick = () => {
        if (disabled) return;
        if (onClick) onClick();
        else if (to) navigate(to, { state: { from: location } });
    };

    return (
        <button
            onClick={handleClick}
            title={title}
            className="main-button"
            style={{
                backgroundColor,
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
                flexDirection: isSmall && !hideLabelOnSmall && !hideIconOnSmall ? "column" : "row"
            }}
            disabled={disabled}
        >
            {/* Icon */}
            {icon && (
                <div style={{ 
                    display: isSmall && hideIconOnSmall ? "none" : "block",
                    placeSelf: "center", 
                    width: isSmall ? (!hideLabelOnSmall && !hideIconOnSmall) ? "16px" : iconSmall : iconLarge, 
                    height: isSmall ? (!hideLabelOnSmall && !hideIconOnSmall) ? "16px" : iconSmall : iconLarge,
                }}>
                    {/* React.isValidElement checks if 'icon' is a valid React element.
                        This ensures that 'icon' is something like <MyIcon /> or <svg>...</svg>,
                        not just a string, number, or undefined.
                    */}
                    {React.isValidElement(icon) &&
                        /*  React.cloneElement creates a *new* React element based on the given one,
                            allowing you to override or add props (like `style` here).
                         */
                        React.cloneElement(icon as React.ReactElement<{ style?: React.CSSProperties }>, {
                            /*  TypeScript type cast: we assert that this element may have a `style` prop,
                                which is an object following the `React.CSSProperties` type.
                                This gives full IntelliSense and prevents TS errors when modifying the style.
                            */
                            style: {
                                width: "100%",
                                height: "100%",
                            },
                        })}
                        {/* The result is a cloned version of the original icon element,
                            but now with style props applied so it fills its container.
                         */}
                </div>
            )}

            {/* Label */}
            <div
                style={{
                    display: hideLabelOnSmall && isSmall ? "none" : "block",
                    fontSize: isSmall ? fontSizeSmall : fontSizeLarge,
                }}
            >
                {labelSmall ?? label}
            </div>

            {/* Optional count badge */}
            {typeof count === "number" && (
                <div
                    style={{
                        position: "absolute",
                        top: "-4px",
                        right: "-4px",
                        backgroundColor: "green",
                        color: "white",
                        borderRadius: "9999px",
                        padding: "4px 0px",
                        fontSize: isSmall ? "0.75em" : "1em",
                        fontWeight: "bold",
                        lineHeight: 1,
                        minWidth: isSmall ? "18px" : "22px",
                        textAlign: "center",
                    }}
                >
                    {count > 99 ? "99+" : count}
                </div>
            )}

        </button>
    );
};