package com.businessdata.controller;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.businessdata.model.UserData;
import com.businessdata.model.UserRole;
import com.businessdata.repository.UserRepository;
import com.businessdata.security.UserAuthentication;

@RestController
public class UserController {

	@Autowired
	UserRepository userRepository;

	@RequestMapping(value = "/api/users/current", method = RequestMethod.GET)
	public UserData getCurrent() throws Exception {

		final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		if (authentication instanceof UserAuthentication) {
			return ((UserAuthentication) authentication).getDetails();
		}
		return new UserData(authentication.getName()); //anonymous user support
	}

	private boolean isAuthenticated(Authentication authentication) {
		return authentication != null
				&& !(authentication instanceof AnonymousAuthenticationToken)
				&& authentication.isAuthenticated();
	}

	@RequestMapping(value = "/api/users/logout", method = RequestMethod.GET)
	public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {

		try {
			final Authentication authentication = SecurityContextHolder
					.getContext().getAuthentication();
			if (authentication != null){

				authentication.setAuthenticated(false);
				SecurityContext ctx = SecurityContextHolder.createEmptyContext();
			    SecurityContextHolder.setContext(ctx);
			    ctx.setAuthentication(null);

	            new SecurityContextLogoutHandler().logout(request, response, authentication);
	        }
	        //SecurityContextHolder.getContext().setAuthentication(null);
			//request.logout();
			//request.getSession().invalidate();

		} catch (Exception e) {
			return new ResponseEntity<String>("Error trying to logout",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
		return new ResponseEntity<String>("logout", HttpStatus.OK);
	}

	@RequestMapping(value = "/api/users/current", method = RequestMethod.POST)
	public ResponseEntity<String> changePassword(
			@RequestBody final UserData user) {
		final Authentication authentication = SecurityContextHolder
				.getContext().getAuthentication();
		final UserData currentUser = userRepository
				.findByUsername(authentication.getName());

		if (user.getNewPassword() == null || user.getNewPassword().length() < 4) {
			return new ResponseEntity<String>("new password to short",
					HttpStatus.UNPROCESSABLE_ENTITY);
		}

		final BCryptPasswordEncoder pwEncoder = new BCryptPasswordEncoder();
		if (!pwEncoder.matches(user.getPassword(), currentUser.getPassword())) {
			return new ResponseEntity<String>("old password mismatch",
					HttpStatus.UNPROCESSABLE_ENTITY);
		}

		currentUser.setPassword(pwEncoder.encode(user.getNewPassword()));
		userRepository.save(currentUser);
		return new ResponseEntity<String>("password changed", HttpStatus.OK);
	}

	@RequestMapping(value = "/admin/api/users/{user}/grant/role/{role}", method = RequestMethod.POST)
	public ResponseEntity<String> grantRole(@PathVariable UserData user,
			@PathVariable UserRole role) {
		if (user == null) {
			return new ResponseEntity<String>("invalid user id",
					HttpStatus.UNPROCESSABLE_ENTITY);
		}

		user.grantRole(role);
		userRepository.save(user);
		return new ResponseEntity<String>("role granted", HttpStatus.OK);
	}

	@RequestMapping(value = "/admin/api/users/{user}/revoke/role/{role}", method = RequestMethod.POST)
	public ResponseEntity<String> revokeRole(@PathVariable UserData user,
			@PathVariable UserRole role) {
		if (user == null) {
			return new ResponseEntity<String>("invalid user id",
					HttpStatus.UNPROCESSABLE_ENTITY);
		}

		user.revokeRole(role);
		userRepository.save(user);
		return new ResponseEntity<String>("role revoked", HttpStatus.OK);
	}

	@RequestMapping(value = "/admin/api/users", method = RequestMethod.GET)
	public Iterable<UserData> list() {
		return userRepository.findAll();
	}
}
